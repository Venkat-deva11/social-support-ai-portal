import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.100',
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'grey.300',
      }}
      role="contentinfo"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} {t('common.appName')}. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Privacy Policy
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Terms of Service
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Contact
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;