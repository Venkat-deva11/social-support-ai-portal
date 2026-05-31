import React, { useEffect, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  FormHelperText,
  Typography,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { familyFinancialSchema } from '../../utils/validation';
import type { FamilyFinancialFormData } from '../../utils/validation';
import { MARITAL_STATUS_OPTIONS, EMPLOYMENT_STATUS_OPTIONS, HOUSING_STATUS_OPTIONS } from '../../constants';
import { useSitecoreContent } from '../../hooks/useSitecoreContent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { updateFamilyFinancialInfo } from '../../features/application/applicationSlice';
import { getCurrencyConfig, formatCurrencyInput, parseCurrencyInput, getCurrencySymbol } from '../../utils/currencyHelper';
import { isNotEmptyArray, isNotEmptyString } from '../../utils/common';
import type { FamilyFinancialFormRef, FamilyFinancialFormProps, FormFieldConfig } from './types';

/**
 * Family Financial Form Component
 * Handles family and financial details input with validation
 */
const FamilyFinancialForm = forwardRef<FamilyFinancialFormRef, FamilyFinancialFormProps>(({ defaultValues }, ref) => {
  const dispatch = useDispatch();
  const content = useSitecoreContent('family-financial-page');
  const formData = useSelector((state: RootState) => state?.application?.formData?.familyFinancialInfo);
  const country = useSelector((state: RootState) => state?.application?.formData?.personalInfo?.country) ?? 'United States';

  const currencyConfig = getCurrencyConfig(country);
  const currencySymbol = getCurrencySymbol(country);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<FamilyFinancialFormData>({
    resolver: yupResolver(familyFinancialSchema) as any,
    mode: 'onChange',
    defaultValues: {
      maritalStatus: formData?.maritalStatus ?? defaultValues?.maritalStatus ?? '',
      dependents: formData?.dependents ?? defaultValues?.dependents ?? 0,
      employmentStatus: formData?.employmentStatus ?? defaultValues?.employmentStatus ?? '',
      monthlyIncome: formData?.monthlyIncome ?? defaultValues?.monthlyIncome ?? 0,
      housingStatus: formData?.housingStatus ?? defaultValues?.housingStatus ?? '',
    },
  });

  const watchedValues = watch();

  const [hasSynced, setHasSynced] = React.useState(false);

  useEffect(() => {
    if (hasSynced) return;

    const hasStoredData = Object.values(formData ?? {}).some(
      (v) => isNotEmptyString(v) || typeof v === 'number'
    );

    if (hasStoredData) {
      reset(formData);
      setHasSynced(true);
    }
  }, [formData, reset, hasSynced]);

  useImperativeHandle(ref, () => ({
    triggerValidation: () => trigger(),
  }), [trigger]);

  // Auto-save on field changes
  useEffect(() => {
    const subscription = watch((data) => {
      if (data) {
        dispatch(updateFamilyFinancialInfo(data as FamilyFinancialFormData));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit = (data: FamilyFinancialFormData) => {
    if (data) {
      dispatch(updateFamilyFinancialInfo(data));
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

  const getDisplayValue = useCallback((value: number | undefined, isFocused: boolean): string => {
    if (value === undefined || value === null) return '';
    if (value === 0) return isFocused ? '' : '';
    if (isFocused) {
      return value.toString();
    }
    return formatCurrencyInput(value, currencyConfig?.code ?? 'USD');
  }, [currencyConfig?.code]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        {content?.title ?? 'Family & Financial Information'}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {content?.description ?? ''}
      </Typography>

      <Grid container spacing={3}>
        {/* Marital Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors?.maritalStatus)} required>
                <InputLabel htmlFor="marital-status-select">
                  {getFieldLabel('maritalStatus', 'Marital Status')}
                </InputLabel>
                <Select
                  {...field}
                  label={getFieldLabel('maritalStatus', 'Marital Status')}
                  slotProps={{
                    input: {
                      id: 'marital-status-select',
                      'aria-required': true,
                      'aria-invalid': Boolean(errors?.maritalStatus),
                    },
                  }}
                >
                  {isNotEmptyArray(MARITAL_STATUS_OPTIONS)
                    ? MARITAL_STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {errors?.maritalStatus && (
                  <FormHelperText>{errors?.maritalStatus?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Number of Dependents */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="dependents"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label={getFieldLabel('dependents', 'Number of Dependents')}
                placeholder={getFieldPlaceholder('dependents', 'Enter number of dependents')}
                helperText={getFieldHelperText('dependents', '')}
                error={Boolean(errors?.dependents)}
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                    'aria-required': true,
                    'aria-invalid': Boolean(errors?.dependents),
                  },
                }}
                onChange={(e) => {
                  const value = parseInt(e?.target?.value ?? '0', 10);
                  field.onChange(isNaN(value) ? 0 : value);
                }}
              />
            )}
          />
          {errors?.dependents && (
            <FormHelperText error>
              {errors?.dependents?.message}
            </FormHelperText>
          )}
        </Grid>

        {/* Employment Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="employmentStatus"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors?.employmentStatus)} required>
                <InputLabel htmlFor="employment-status-select">
                  {getFieldLabel('employmentStatus', 'Employment Status')}
                </InputLabel>
                <Select
                  {...field}
                  label={getFieldLabel('employmentStatus', 'Employment Status')}
                  slotProps={{
                    input: {
                      id: 'employment-status-select',
                      'aria-required': true,
                      'aria-invalid': Boolean(errors?.employmentStatus),
                    },
                  }}
                >
                  {isNotEmptyArray(EMPLOYMENT_STATUS_OPTIONS)
                    ? EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {errors?.employmentStatus && (
                  <FormHelperText>{errors?.employmentStatus?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Monthly Income - Currency formatted, no spinner arrows */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="monthlyIncome"
            control={control}
            render={({ field }) => {
              // Track focus state for better UX
              const [isFocused, setIsFocused] = useState(false);

              const displayValue = getDisplayValue(field.value, isFocused);

              return (
                <TextField
                  {...field}
                  fullWidth
                  label={getFieldLabel('monthlyIncome', 'Monthly Income')}
                  placeholder={getFieldPlaceholder('monthlyIncome', 'Enter your monthly income')}
                  helperText={getFieldHelperText('monthlyIncome', `${currencySymbol} ${currencyConfig?.code ?? ''}`)}
                  error={Boolean(errors?.monthlyIncome)}
                  required
                  value={displayValue}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    if (field.value === undefined || field.value === null) {
                      field.onChange(0);
                    }
                  }}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 'any',
                      'aria-required': true,
                      'aria-invalid': Boolean(errors?.monthlyIncome),
                      inputMode: 'numeric',
                      sx: {
                        '&::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                        '&::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                        MozAppearance: 'textfield',
                      },
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          {currencySymbol}
                        </InputAdornment>
                      ),
                    },
                  }}
                  onChange={(e) => {
                    const rawValue = e?.target?.value ?? '';
                    const parsed = parseCurrencyInput(rawValue, currencyConfig?.code ?? 'USD');
                    field.onChange(isNaN(parsed) ? 0 : parsed);
                  }}
                />
              );
            }}
          />
          {errors?.monthlyIncome && (
            <FormHelperText error>
              {errors?.monthlyIncome?.message}
            </FormHelperText>
          )}
        </Grid>

        {/* Housing Status */}
        <Grid size={12}>
          <Controller
            name="housingStatus"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors?.housingStatus)} required>
                <InputLabel htmlFor="housing-status-select">
                  {getFieldLabel('housingStatus', 'Housing Status')}
                </InputLabel>
                <Select
                  {...field}
                  label={getFieldLabel('housingStatus', 'Housing Status')}
                  slotProps={{
                    input: {
                      id: 'housing-status-select',
                      'aria-required': true,
                      'aria-invalid': Boolean(errors?.housingStatus),
                    },
                  }}
                >
                  {isNotEmptyArray(HOUSING_STATUS_OPTIONS)
                    ? HOUSING_STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {errors?.housingStatus && (
                  <FormHelperText>{errors?.housingStatus?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
});

FamilyFinancialForm.displayName = 'FamilyFinancialForm';

export default FamilyFinancialForm;