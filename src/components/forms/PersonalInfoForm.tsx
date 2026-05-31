import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { personalInfoSchema } from '../../utils/validation';
import type { PersonalInfoFormData } from '../../utils/validation';
import { GENDER_OPTIONS, COUNTRIES } from '../../constants';
import { useSitecoreContent } from '../../hooks/useSitecoreContent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { updatePersonalInfo } from '../../features/application/applicationSlice';

export interface PersonalInfoFormRef {
  triggerValidation: () => Promise<boolean>;
}

interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfoFormData>;
}

const PersonalInfoForm = forwardRef<PersonalInfoFormRef, PersonalInfoFormProps>(({ defaultValues }, ref) => {
  const dispatch = useDispatch();
  const content = useSitecoreContent('personal-information-page');
  const formData = useSelector((state: RootState) => state.application.formData.personalInfo);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: yupResolver(personalInfoSchema) as any,
    mode: 'onChange',
    defaultValues: {
      fullName: formData.fullName || defaultValues?.fullName || '',
      nationalId: formData.nationalId || defaultValues?.nationalId || '',
      dateOfBirth: formData.dateOfBirth || defaultValues?.dateOfBirth || '',
      gender: formData.gender || defaultValues?.gender || '',
      address: formData.address || defaultValues?.address || '',
      city: formData.city || defaultValues?.city || '',
      state: formData.state || defaultValues?.state || '',
      country: formData.country || defaultValues?.country || '',
      phone: formData.phone || defaultValues?.phone || '',
      email: formData.email || defaultValues?.email || '',
    },
  });

  const watchedValues = watch();

  // Sync form with Redux state when data is restored from localStorage
  // This handles the case where Redux store is rehydrated on page refresh
  const [hasSynced, setHasSynced] = React.useState(false);

  useEffect(() => {
    // Only sync once when formData has actual values (restored from localStorage)
    // and we haven't synced yet
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
      dispatch(updatePersonalInfo(data as PersonalInfoFormData));
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, dispatch]);

  const onSubmit = (data: PersonalInfoFormData) => {
    dispatch(updatePersonalInfo(data));
  };

  const fields = content?.fields as unknown as Record<string, {
    label: string;
    placeholder: string;
    helperText: string;
    errorMessage: Record<string, string>;
  }>;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        {content?.title || 'Personal Information'}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {content?.description || ''}
      </Typography>

      <Grid container spacing={3}>
        {/* Full Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={fields?.fullName?.label || 'Full Name'}
                placeholder={fields?.fullName?.placeholder || 'Enter your full name'}
                helperText={fields?.fullName?.helperText || ''}
                error={Boolean(errors.fullName)}
                required
                slotProps={{
                  input: {
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.fullName),
                    'aria-describedby': errors.fullName ? 'fullName-error' : 'fullName-helper',
                  },
                }}
              />
            )}
          />
          {errors.fullName && (
            <FormHelperText error id="fullName-error">
              {errors.fullName.message}
            </FormHelperText>
          )}
        </Grid>

        {/* National ID */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="nationalId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={fields?.nationalId?.label || 'National ID'}
                placeholder={fields?.nationalId?.placeholder || 'Enter your national ID'}
                helperText={fields?.nationalId?.helperText || ''}
                error={Boolean(errors.nationalId)}
                required
                slotProps={{
                  input: {
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.nationalId),
                  },
                }}
              />
            )}
          />
          {errors.nationalId && (
            <FormHelperText error>
              {errors.nationalId.message}
            </FormHelperText>
          )}
        </Grid>

        {/* Date of Birth */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                label={fields?.dateOfBirth?.label || 'Date of Birth'}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.dateOfBirth),
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                helperText={fields?.dateOfBirth?.helperText || ''}
                error={Boolean(errors.dateOfBirth)}
                required
              />
            )}
          />
          {errors.dateOfBirth && (
            <FormHelperText error>
              {errors.dateOfBirth.message}
            </FormHelperText>
          )}
        </Grid>

        {/* Gender */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.gender)} required>
                <InputLabel htmlFor="gender-select">
                  {fields?.gender?.label || 'Gender'}
                </InputLabel>
                <Select
                  {...field}
                  label={fields?.gender?.label || 'Gender'}
                  slotProps={{
                    input: {
                      'aria-required': true,
                      'aria-invalid': Boolean(errors.gender),
                      id: 'gender-select',
                    },
                  }}
                >
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.gender && (
                  <FormHelperText>{errors.gender.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Address */}
        <Grid size={12}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={fields?.address?.label || 'Address'}
                placeholder={fields?.address?.placeholder || 'Enter your full residential address'}
                helperText={fields?.address?.helperText || ''}
                error={Boolean(errors.address)}
                required
                slotProps={{
                  input: {
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.address),
                  },
                }}
              />
            )}
          />
          {errors.address && (
            <FormHelperText error>
              {errors.address.message}
            </FormHelperText>
          )}
        </Grid>

        {/* City */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={fields?.city?.label || 'City'}
                placeholder={fields?.city?.placeholder || 'Enter your city'}
                error={Boolean(errors.city)}
                required
                slotProps={{
                  input: {
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.city),
                  },
                }}
              />
            )}
          />
          {errors.city && (
            <FormHelperText error>
              {errors.city.message}
            </FormHelperText>
          )}
        </Grid>

        {/* State */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={fields?.state?.label || 'State/Province'}
                placeholder={fields?.state?.placeholder || 'Enter your state or province'}
                error={Boolean(errors.state)}
                required
                slotProps={{
                  input: {
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.state),
                  },
                }}
              />
            )}
          />
          {errors.state && (
            <FormHelperText error>
              {errors.state.message}
            </FormHelperText>
          )}
        </Grid>

        {/* Country */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.country)} required>
                <InputLabel htmlFor="country-select">
                  {fields?.country?.label || 'Country'}
                </InputLabel>
                <Select
                  {...field}
                  label={fields?.country?.label || 'Country'}
                  slotProps={{
                    input: {
                      'aria-required': true,
                      'aria-invalid': Boolean(errors.country),
                      id: 'country-select',
                    },
                  }}
                >
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
                {errors.country && (
                  <FormHelperText>{errors.country.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Phone */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={fields?.phone?.label || 'Phone Number'}
                placeholder={fields?.phone?.placeholder || '+1 234 567 8900'}
                helperText={fields?.phone?.helperText || ''}
                error={Boolean(errors.phone)}
                required
                slotProps={{
                  input: {
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.phone),
                  },
                }}
              />
            )}
          />
          {errors.phone && (
            <FormHelperText error>
              {errors.phone.message}
            </FormHelperText>
          )}
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="email"
                label={fields?.email?.label || 'Email Address'}
                placeholder={fields?.email?.placeholder || 'Enter your email address'}
                helperText={fields?.email?.helperText || ''}
                error={Boolean(errors.email)}
                required
                slotProps={{
                  input: {
                    'aria-required': true,
                    'aria-invalid': Boolean(errors.email),
                  },
                }}
              />
            )}
          />
          {errors.email && (
            <FormHelperText error>
              {errors.email.message}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    </Box>
  );
});

PersonalInfoForm.displayName = 'PersonalInfoForm';

export default PersonalInfoForm;
