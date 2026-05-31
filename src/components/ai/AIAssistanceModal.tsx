import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import type { AIAuthoringField } from '../../services/openai/openaiService';

interface AIAssistanceModalProps {
  open: boolean;
  onClose: () => void;
  field: AIAuthoringField;
  fieldLabel: string;
  existingContent?: string;
  onAccept: (content: string) => void;
  placeholder?: string;
  helperText?: string;
}

const AIAssistanceModal: React.FC<AIAssistanceModalProps> = ({
  open,
  onClose,
  field,
  fieldLabel,
  existingContent,
  onAccept,
  placeholder,
  helperText,
}) => {
  const { t } = useTranslation();
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get user data from Redux state for contextual AI assistance
  const userData = useSelector((state: RootState) => ({
    personalInfo: state.application.formData.personalInfo,
    familyFinancialInfo: state.application.formData.familyFinancialInfo,
  }));

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setGeneratedContent('');
      setEditedContent('');
      setIsGenerating(false);
      setError(null);
      setIsEditing(false);
      setShowEditor(false);
    }
  }, [open]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedContent('');
    setShowEditor(false);

    // Create abort controller for timeout handling
    abortControllerRef.current = new AbortController();

    // Pass only familyFinancialInfo from Redux - no stale existingContent
    const result = await OpenAIService.generateText(
      field,
      userData.familyFinancialInfo
    );

    setIsGenerating(false);

    if (result.success && result.data) {
      setGeneratedContent(result.data);
      setEditedContent(result.data);
      setShowEditor(true);
    } else {
      setError(result.error || t('common.failedToGenerate'));
    }
  }, [field, userData.familyFinancialInfo, t]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onClose();
  }, [onClose]);

  const handleAccept = useCallback(() => {
    const contentToAccept = isEditing ? editedContent : generatedContent;
    onAccept(contentToAccept);
    onClose();
  }, [isEditing, editedContent, generatedContent, onAccept, onClose]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleDiscard = useCallback(() => {
    setGeneratedContent('');
    setEditedContent('');
    setShowEditor(false);
    setError(null);
  }, []);

  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditedContent(event.target.value);
    },
    []
  );

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      aria-labelledby="ai-assistance-dialog-title"
    >
      <DialogTitle id="ai-assistance-dialog-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="span">
            {t('common.aiAssistanceTitle')}
          </Typography>
          <IconButton
            onClick={handleCancel}
            aria-label={t('common.close')}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {t('common.aiAssistanceDescription')}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {fieldLabel}
        </Typography>

        {!showEditor && !isGenerating && !error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerate}
              size="large"
            >
              {t('common.helpMeWrite')}
            </Button>
          </Box>
        )}

        {isGenerating && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress aria-label={t('common.generatingContent')} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              {t('common.generatingContent')}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={handleGenerate}>
              {t('common.retry')}
            </Button>
          }>
            {error}
          </Alert>
        )}

        {showEditor && (
          <Box>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={6}
                value={editedContent}
                onChange={handleContentChange}
                placeholder={placeholder}
                helperText={helperText}
                slotProps={{
                  input: {
                    'aria-label': `${fieldLabel} - editing`,
                  },
                }}
              />
            ) : (
              <Box
                sx={{
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap',
                }}
                role="region"
                aria-label={`${fieldLabel} - generated content`}
              >
                {generatedContent}
              </Box>
            )}

            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              {editedContent.length} / 2000 characters
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {!showEditor && (
          <Button onClick={handleCancel}>{t('common.cancel')}</Button>
        )}

        {showEditor && !isEditing && (
          <>
            <Button onClick={handleDiscard} color="inherit">
              {t('common.discard')}
            </Button>
            <Button onClick={handleEdit} color="primary">
              {t('common.edit')}
            </Button>
            <Button onClick={handleAccept} variant="contained" color="primary">
              {t('common.accept')}
            </Button>
          </>
        )}

        {showEditor && isEditing && (
          <>
            <Button onClick={handleDiscard} color="inherit">
              {t('common.discard')}
            </Button>
            <Button onClick={handleAccept} variant="contained" color="primary">
              {t('common.accept')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Import OpenAIService at the bottom to avoid circular dependency
import { OpenAIService } from '../../services/openai/openaiService';

export default AIAssistanceModal;