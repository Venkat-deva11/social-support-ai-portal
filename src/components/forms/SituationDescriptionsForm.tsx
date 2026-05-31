import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  Typography,
  Button,
  FormHelperText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import {
  situationDescriptionsSchema,
} from '../../utils/validation';
import type { SituationDescriptionsFormData } from '../../utils/validation';
import { FORM_LIMITS } from '../../constants';
import { useSitecoreContent } from '../../hooks/useSitecoreContent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { updateSituationDescriptions } from '../../features/application/applicationSlice';
import AIAssistanceModal from '../ai/AIAssistanceModal';
import type { AIAuthoringField } from '../../services/openai/openaiService';

interface SituationDescriptionsFormProps {
  defaultValues?: Partial<SituationDescriptionsFormData>;
}

const SituationDescriptionsForm: React.FC<SituationDescriptionsFormProps> = ({
  defaultValues,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const content = useSitecoreContent('situation-description-page');
  const formData = useSelector(
    (state: RootState) => state.application.formData.situationDescriptions
  );

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<AIAuthoringField>('financialSituation');
  const [activeFieldLabel, setActiveFieldLabel] = useState('');
  const [activeFieldContent, setActiveFieldContent] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SituationDescriptionsFormData>({
    resolver: yupResolver(situationDescriptionsSchema) as any,
    mode: 'onChange',
    defaultValues: {
      financialSituation:
        formData.financialSituation || defaultValues?.financialSituation || '',
      employmentCircumstances:
        formData.employmentCircumstances || defaultValues?.employmentCircumstances || '',
      reasonForApplying:
        formData.reasonForApplying || defaultValues?.reasonForApplying || '',
    },
  });

  const watchedValues = watch();

  // Auto-save on field changes
  useEffect(() => {
    const subscription = watch((data) => {
      dispatch(updateSituationDescriptions(data as SituationDescriptionsFormData));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit = (data: SituationDescriptionsFormData) => {
    dispatch(updateSituationDescriptions(data));
  };

  const handleOpenAIModal = (
    field: AIAuthoringField,
    fieldLabel: string,
    currentContent: string
  ) => {
    setActiveField(field);
    setActiveFieldLabel(fieldLabel);
    setActiveFieldContent(currentContent);
    setAiModalOpen(true);
  };

  const handleAIAccept = useCallback(
    (content: string) => {
      setValue(activeField, content, { shouldValidate: true });
    },
    [activeField, setValue]
  );

  const fields = content?.fields as unknown as Record<string, {
    label: string;
    placeholder: string;
    helperText: string;
    errorMessage: Record<string, string>;
  }>;

  const renderTextArea = (
    fieldName: 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying',
    label: string,
    placeholder: string,
    helperText: string
  ) => {
    const fieldValue = watchedValues[fieldName] || '';

    return (
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" component="label" htmlFor={`${fieldName}-input`}>
                {label}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => handleOpenAIModal(fieldName, label, fieldValue)}
                aria-label={`${t('common.helpMeWrite')} for ${label}`}
              >
                {t('common.helpMeWrite')}
              </Button>
            </Box>

            <TextField
              {...field}
              fullWidth
              multiline
              rows={6}
              placeholder={placeholder}
              helperText={helperText}
              error={Boolean(errors[fieldName])}
              required
              id={`${fieldName}-input`}
              slotProps={{
                htmlInput: {
                  'aria-required': true,
                  'aria-invalid': Boolean(errors[fieldName]),
                  'aria-describedby': `${fieldName}-helper`,
                  maxLength: FORM_LIMITS.TEXTAREA_MAX + 1,
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              {errors[fieldName] && (
                <FormHelperText error>{errors[fieldName]?.message}</FormHelperText>
              )}
              <Typography
                variant="caption"
                sx={{
                  color: fieldValue.length > FORM_LIMITS.TEXTAREA_MAX ? 'error.main' : 'text.secondary',
                  ml: 'auto',
                }}
              >
                {fieldValue.length} / {FORM_LIMITS.TEXTAREA_MAX} characters
              </Typography>
            </Box>
          </Box>
        )}
      />
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        {content?.title || 'Situation Descriptions'}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {content?.description || ''}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12}>
          {renderTextArea(
            'financialSituation',
            fields?.financialSituation?.label || 'Current Financial Situation',
            fields?.financialSituation?.placeholder || 'Describe your current financial situation...',
            fields?.financialSituation?.helperText || ''
          )}
        </Grid>

        <Grid size={12}>
          {renderTextArea(
            'employmentCircumstances',
            fields?.employmentCircumstances?.label || 'Employment Circumstances',
            fields?.employmentCircumstances?.placeholder || 'Describe your employment circumstances...',
            fields?.employmentCircumstances?.helperText || ''
          )}
        </Grid>

        <Grid size={12}>
          {renderTextArea(
            'reasonForApplying',
            fields?.reasonForApplying?.label || 'Reason For Applying',
            fields?.reasonForApplying?.placeholder || 'Explain why you are applying for assistance...',
            fields?.reasonForApplying?.helperText || ''
          )}
        </Grid>
      </Grid>

      <AIAssistanceModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        field={activeField}
        fieldLabel={activeFieldLabel}
        existingContent={activeFieldContent}
        onAccept={handleAIAccept}
        placeholder={
          activeField === 'financialSituation'
            ? fields?.financialSituation?.placeholder
            : activeField === 'employmentCircumstances'
            ? fields?.employmentCircumstances?.placeholder
            : fields?.reasonForApplying?.placeholder
        }
        helperText={
          activeField === 'financialSituation'
            ? fields?.financialSituation?.helperText
            : activeField === 'employmentCircumstances'
            ? fields?.employmentCircumstances?.helperText
            : fields?.reasonForApplying?.helperText
        }
      />
    </Box>
  );
};

export default SituationDescriptionsForm;