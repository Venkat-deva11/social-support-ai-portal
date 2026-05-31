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
import {
  familyFinancialSchema,
} from '../../utils/validation';
import type { FamilyFinancialFormData } from '../../utils/validation';
import {
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  HOUSING_STATUS_OPTIONS,
} from '../../constants';
import { useSitecoreContent } from '../../hooks/useSitecoreContent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { updateFamilyFinancialInfo } from '../../features/application/applicationSlice';
import {
  getCurrencyConfig,
  formatCurrencyInput,
  parseCurrencyInput,
  getCurrencySymbol,
  getCurrencyDecimals,
} from '../../utils/currencyHelper';

export interface FamilyFinancialFormRef {
  triggerValidation: () => Promise<boolean>;
}

interface FamilyFinancialFormProps {
  defaultValues?: Partial<FamilyFinancialFormData>;
}

const FamilyFinancialForm = forwardRef<FamilyFinancialFormRef, FamilyFinancialFormProps>(({ defaultValues }, ref) => {
  const dispatch = useDispatch();
  const content = useSitecoreContent('family-financial-page');
  const formData = useSelector(
    (state: RootState) => state.application.formData.familyFinancialInfo
  );
  const country = useSelector(
    (state: RootState) => state.application.formData.personalInfo?.country
  ) || 'United States';

  // Get currency config based on country
  const currencyConfig = getCurrencyConfig(country);
  const currencySymbol = getCurrencySymbol(country);
  const currencyDecimals = getCurrencyDecimals(country);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    reset,
    setValue,
  } = useForm<FamilyFinancialFormData>({
    resolver: yupResolver(familyFinancialSchema) as any,
    mode: 'onChange',
    defaultValues: {
      maritalStatus: formData.maritalStatus || defaultValues?.maritalStatus || '',
      dependents: formData.dependents ?? defaultValues?.dependents ?? 0,
      employmentStatus: formData.employmentStatus || defaultValues?.employmentStatus || '',
      monthlyIncome: formData.monthlyIncome ?? defaultValues?.monthlyIncome ?? 0,
      housingStatus: formData.housingStatus || defaultValues?.housingStatus || '',
    },
  });

  const watchedValues = watch();

  // Sync form with Redux state when data is restored from localStorage
  const [hasSynced, setHasSynced] = React.useState(false);

  useEffect(() => {
    if (hasSynced) return;

    const hasStoredData = Object.values(formData).some(v => v !== '' && v !== null && v !== undefined);
    if (hasStoredData) {
      reset(formData);
      setHasSynced(true);
    }
  }, [formData, reset, hasSynced]);

  // Expose triggerValidation to parent
  useImperativeHandle(ref, () => ({
    triggerValidation: () => trigger(),
  }), [trigger]);

  // Auto-save on field changes
  useEffect(() => {
    const subscription = watch((data) => {
      dispatch(updateFamilyFinancialInfo(data as FamilyFinancialFormData));
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, dispatch]);

  const onSubmit = (data: FamilyFinancialFormData) => {
    dispatch(updateFamilyFinancialInfo(data));
  };

  const fields = content?.fields as unknown as Record<string, {
    label: string;
    placeholder: string;
    helperText: string;
    errorMessage: Record<string, string>;
  }>;

  // Handle monthly income display value - shows formatted value when not focused
  const getDisplayValue = useCallback((value: number | undefined, isFocused: boolean): string => {
    if (value === undefined || value === null) return '';
    if (value === 0) return isFocused ? '' : '';
    if (isFocused) {
      // When focused, show raw number for easy editing
      return value.toString();
    }
    // When not focused, show formatted value
    return formatCurrencyInput(value, currencyConfig.code);
  }, [currencyConfig.code]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        {content?.title || 'Family & Financial Information'}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {content?.description || ''}
      </Typography>

      <Grid container spacing={3}>
        {/* Marital Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.maritalStatus)} required>
                <InputLabel htmlFor="marital-status-select">
                  {fields?.maritalStatus?.label || 'Marital Status'}
                </InputLabel>
                <Select
                  {...field}
                  label={fields?.maritalStatus?.label || 'Marital Status'}
                  slotProps={{
                    input: {
                      id: 'marital-status-select',
                      'aria-required': true,
                      'aria-invalid': Boolean(errors.maritalStatus),
                    },
                  }}
                >
                  {MARITAL_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.maritalStatus && (
                  <FormHelperText>{errors.maritalStatus.message}</FormHelperText>
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
                label={fields?.dependents?.label || 'Number of Dependents'}
                placeholder={fields?.dependents?.placeholder || 'Enter number of dependents'}
                helperText={fields?.dependents?.helperText || ''}
                error={Boolean(errors.dependents)}
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.dependents),
                  },
                }}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  field.onChange(isNaN(value) ? 0 : value);
                }}
              />
            )}
          />
          {errors.dependents && (
            <FormHelperText error>
              {errors.dependents.message}
            </FormHelperText>
          )}
        </Grid>

        {/* Employment Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="employmentStatus"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.employmentStatus)} required>
                <InputLabel htmlFor="employment-status-select">
                  {fields?.employmentStatus?.label || 'Employment Status'}
                </InputLabel>
                <Select
                  {...field}
                  label={fields?.employmentStatus?.label || 'Employment Status'}
                  slotProps={{
                    input: {
                      id: 'employment-status-select',
                      'aria-required': true,
                      'aria-invalid': Boolean(errors.employmentStatus),
                    },
                  }}
                >
                  {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.employmentStatus && (
                  <FormHelperText>{errors.employmentStatus.message}</FormHelperText>
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
              const [isFocused, setIsFocused] = React.useState(false);

              // Display raw value when focused for easy editing, formatted when blurred
              const displayValue = getDisplayValue(field.value, isFocused);

              return (
                <TextField
                  {...field}
                  fullWidth
                  label={fields?.monthlyIncome?.label || 'Monthly Income'}
                  placeholder={fields?.monthlyIncome?.placeholder || 'Enter your monthly income'}
                  helperText={fields?.monthlyIncome?.helperText || `${currencySymbol} ${currencyConfig.code}`}
                  error={Boolean(errors.monthlyIncome)}
                  required
                  value={displayValue}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    // Ensure value is properly saved on blur
                    if (field.value === undefined || field.value === null) {
                      field.onChange(0);
                    }
                  }}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 'any',
                      'aria-required': true,
                      'aria-invalid': Boolean(errors.monthlyIncome),
                      inputMode: 'numeric',
                      // Hide spin buttons for better UX with large numbers
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
                    const rawValue = e.target.value;
                    const parsed = parseCurrencyInput(rawValue, currencyConfig.code);
                    field.onChange(isNaN(parsed) ? 0 : parsed);
                  }}
                />
              );
            }}
          />
          {errors.monthlyIncome && (
            <FormHelperText error>
              {errors.monthlyIncome.message}
            </FormHelperText>
          )}
        </Grid>

        {/* Housing Status */}
        <Grid size={12}>
          <Controller
            name="housingStatus"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.housingStatus)} required>
                <InputLabel htmlFor="housing-status-select">
                  {fields?.housingStatus?.label || 'Housing Status'}
                </InputLabel>
                <Select
                  {...field}
                  label={fields?.housingStatus?.label || 'Housing Status'}
                  slotProps={{
                    input: {
                      id: 'housing-status-select',
                      'aria-required': true,
                      'aria-invalid': Boolean(errors.housingStatus),
                    },
                  }}
                >
                  {HOUSING_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.housingStatus && (
                  <FormHelperText>{errors.housingStatus.message}</FormHelperText>
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