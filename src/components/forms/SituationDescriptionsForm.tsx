import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
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
import { situationDescriptionsSchema } from '../../utils/validation';
import type { SituationDescriptionsFormData } from '../../utils/validation';
import { FORM_LIMITS } from '../../constants';
import { useSitecoreContent } from '../../hooks/useSitecoreContent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { updateSituationDescriptions } from '../../features/application/applicationSlice';
import AIAssistanceModal from '../ai/AIAssistanceModal';
import { isNotEmptyString } from '../../utils/common';
import type { AIAuthoringField } from '../../services/openai/types';
import type { SituationDescriptionsFormRef, SituationDescriptionsFormProps, FormFieldConfig } from './types';

/**
 * Situation Descriptions Form Component
 * Handles situation description inputs with AI assistance
 */
const SituationDescriptionsForm = forwardRef<SituationDescriptionsFormRef, SituationDescriptionsFormProps>(({ defaultValues }, ref) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const content = useSitecoreContent('situation-description-page');
  const formData = useSelector((state: RootState) => state?.application?.formData?.situationDescriptions);

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
    trigger,
    reset,
  } = useForm<SituationDescriptionsFormData>({
    resolver: yupResolver(situationDescriptionsSchema) as any,
    mode: 'onChange',
    defaultValues: {
      financialSituation: formData?.financialSituation ?? defaultValues?.financialSituation ?? '',
      employmentCircumstances: formData?.employmentCircumstances ?? defaultValues?.employmentCircumstances ?? '',
      reasonForApplying: formData?.reasonForApplying ?? defaultValues?.reasonForApplying ?? '',
    },
  });

  const watchedValues = watch();

  const [hasSynced, setHasSynced] = React.useState(false);

  useEffect(() => {
    if (hasSynced) return;

    const hasStoredData = Object.values(formData ?? {}).some(
      (v) => isNotEmptyString(v)
    );

    if (hasStoredData) {
      reset(formData);
      setHasSynced(true);
    }
  }, [formData, reset, hasSynced]);

  useImperativeHandle(ref, () => ({
    triggerValidation: () => trigger(),
  }), [trigger]);

  useEffect(() => {
    const subscription = watch((data) => {
      if (data) {
        dispatch(updateSituationDescriptions(data as SituationDescriptionsFormData));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit = (data: SituationDescriptionsFormData) => {
    if (data) {
      dispatch(updateSituationDescriptions(data));
    }
  };

  const getFieldConfig = (fieldName: string): FormFieldConfig | null => {
    const fields = content?.fields as Record<string, FormFieldConfig> | undefined;
    if (!fields) return null;
    return fields[fieldName] ?? null;
  };

  const getFieldLabel = (fieldName: string, fallback: string): string => {
    const config = getFieldConfig(fieldName);
    return config?.label ?? fallback;
  };

  const getFieldPlaceholder = (fieldName: string, fallback: string): string => {
    const config = getFieldConfig(fieldName);
    return config?.placeholder ?? fallback;
  };

  const getFieldHelperText = (fieldName: string, fallback: string): string => {
    const config = getFieldConfig(fieldName);
    return config?.helperText ?? fallback;
  };

  const handleOpenAIModal = (
    field: AIAuthoringField,
    fieldLabel: string,
    currentContent: string
  ) => {
    setActiveField(field);
    setActiveFieldLabel(fieldLabel);
    setActiveFieldContent(currentContent ?? '');
    setAiModalOpen(true);
  };

  const handleAIAccept = useCallback(
    (contentValue: string) => {
      if (activeField) {
        setValue(activeField, contentValue, { shouldValidate: true });
      }
    },
    [activeField, setValue]
  );

  const renderTextArea = (
    fieldName: 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying',
    label: string,
    placeholder: string,
    helperText: string
  ) => {
    const fieldValue = watchedValues?.[fieldName] ?? '';

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
              error={Boolean(errors?.[fieldName])}
              required
              id={`${fieldName}-input`}
              slotProps={{
                htmlInput: {
                  'aria-required': true,
                  'aria-invalid': Boolean(errors?.[fieldName]),
                  'aria-describedby': `${fieldName}-helper`,
                  maxLength: (FORM_LIMITS?.TEXTAREA_MAX ?? 2000) + 1,
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              {errors?.[fieldName] && (
                <FormHelperText error>{errors?.[fieldName]?.message}</FormHelperText>
              )}
              <Typography
                variant="caption"
                sx={{
                  color: (fieldValue?.length ?? 0) > (FORM_LIMITS?.TEXTAREA_MAX ?? 2000) ? 'error.main' : 'text.secondary',
                  ml: 'auto',
                }}
              >
                {fieldValue?.length ?? 0} / {FORM_LIMITS?.TEXTAREA_MAX ?? 2000} characters
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
        {content?.title ?? 'Situation Descriptions'}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {content?.description ?? ''}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12}>
          {renderTextArea(
            'financialSituation',
            getFieldLabel('financialSituation', 'Current Financial Situation'),
            getFieldPlaceholder('financialSituation', 'Describe your current financial situation...'),
            getFieldHelperText('financialSituation', '')
          )}
        </Grid>

        <Grid size={12}>
          {renderTextArea(
            'employmentCircumstances',
            getFieldLabel('employmentCircumstances', 'Employment Circumstances'),
            getFieldPlaceholder('employmentCircumstances', 'Describe your employment circumstances...'),
            getFieldHelperText('employmentCircumstances', '')
          )}
        </Grid>

        <Grid size={12}>
          {renderTextArea(
            'reasonForApplying',
            getFieldLabel('reasonForApplying', 'Reason For Applying'),
            getFieldPlaceholder('reasonForApplying', 'Explain why you are applying for assistance...'),
            getFieldHelperText('reasonForApplying', '')
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
            ? getFieldPlaceholder('financialSituation', '')
            : activeField === 'employmentCircumstances'
            ? getFieldPlaceholder('employmentCircumstances', '')
            : getFieldPlaceholder('reasonForApplying', '')
        }
        helperText={
          activeField === 'financialSituation'
            ? getFieldHelperText('financialSituation', '')
            : activeField === 'employmentCircumstances'
            ? getFieldHelperText('employmentCircumstances', '')
            : getFieldHelperText('reasonForApplying', '')
        }
      />
    </Box>
  );
});

SituationDescriptionsForm.displayName = 'SituationDescriptionsForm';

export default SituationDescriptionsForm;