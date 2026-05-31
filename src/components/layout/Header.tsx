import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { setLanguage } from '../../features/application/applicationSlice';
import { setRTL } from '../../features/ui/uiSlice';
import i18n from '../../i18n';
import { getLanguageDirection } from '../../utils/sitecoreContentHelper';
import { STEPS } from '../../constants';

const STEP_TITLES: Record<number, string> = {
  [STEPS.PERSONAL_INFO]: 'pages.personalInformation.title',
  [STEPS.FAMILY_FINANCIAL]: 'pages.familyFinancialInformation.title',
  [STEPS.SITUATION_DESCRIPTIONS]: 'pages.situationDescriptions.title',
};

/**
 * Header Component
 * Application header with language selector and breadcrumbs
 */
const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state?.application?.language);
  const currentStep = useSelector((state: RootState) => state?.application?.currentStep);

  const handleLanguageChange = (event: { target: { value: unknown } }) => {
    const newLang = event?.target?.value as 'en' | 'ar';
    if (newLang) {
      dispatch(setLanguage(newLang));
      dispatch(setRTL(newLang === 'ar'));
      i18n.changeLanguage(newLang);
      document.documentElement.dir = getLanguageDirection(newLang);
      document.documentElement.lang = newLang;
    }
  };

  const currentPageTitle = STEP_TITLES[currentStep] ?? STEP_TITLES[STEPS.PERSONAL_INFO];

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        py: 2,
        px: 3,
        boxShadow: 2,
      }}
      role="banner"
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {t('common.appName') ?? 'Social Support Application'}
          </Typography>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              '& .MuiBreadcrumbs-separator': { color: 'inherit' },
              '& .MuiTypography-root': { color: 'inherit' },
            }}
          >
            <Link
              href="#"
              underline="hover"
              sx={{ color: 'inherit' }}
              aria-label="Home"
            >
              {t('common.appName') ?? 'Social Support Application'}
            </Link>
            <Typography sx={{ color: 'inherit' }}>
              {t(currentPageTitle) ?? ''}
            </Typography>
          </Breadcrumbs>
        </Box>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel
            id="language-select-label"
            sx={{ color: 'inherit', '&.Mui-focused': { color: 'inherit' } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LanguageIcon fontSize="small" />
              {t('common.language') ?? 'Language'}
            </Box>
          </InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language ?? 'en'}
            onChange={handleLanguageChange}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LanguageIcon fontSize="small" />
                {t('common.language') ?? 'Language'}
              </Box>
            }
            sx={{
              color: 'inherit',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.5)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '& .MuiSvgIcon-root': {
                color: 'inherit',
              },
            }}
            slotProps={{
              input: {
                'aria-label': t('common.language') ?? 'Language',
              },
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ar">العربية</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Header;