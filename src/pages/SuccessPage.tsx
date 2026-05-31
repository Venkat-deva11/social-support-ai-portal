import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { SuccessPageContent } from '../features/ui/types';



const SuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const content: SuccessPageContent = {
    title: t('pages.applicationSuccess.title'),
    description: t('pages.applicationSuccess.description'),
    mainMessage: t('pages.applicationSuccess.mainMessage'),
    subMessage: t('pages.applicationSuccess.subMessage'),
    referenceNumber: t('pages.applicationSuccess.referenceNumber'),
    nextSteps: t('pages.applicationSuccess.nextSteps'),
    nextStepsList: t('pages.applicationSuccess.nextStepsList', { returnObjects: true }) as string[],
    backToHome: t('pages.applicationSuccess.backToHome'),
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
        }}
        role="main"
        aria-labelledby="success-title"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 80, color: 'success.main' }}
            aria-hidden="true"
          />
        </Box>

        <Typography
          id="success-title"
          variant="h4"
          component="h1"
          sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}
        >
          {content.title}
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          {content.description}
        </Typography>

        <Box
          sx={{
            backgroundColor: 'grey.50',
            p: 3,
            borderRadius: 2,
            my: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {content.mainMessage}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {content.subMessage}
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: 'primary.light',
            color: 'primary.contrastText',
            p: 2,
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Typography variant="body2">
            {content.referenceNumber}: SSA-{Date.now().toString(36).toUpperCase()}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {content.nextSteps}
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {(content.nextStepsList as string[]).map((step, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">{step}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToHome}
          size="large"
          aria-label={content.backToHome}
        >
          {content.backToHome}
        </Button>
      </Paper>
    </Container>
  );
};

export default SuccessPage;