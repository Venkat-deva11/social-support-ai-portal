import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import Box from '@mui/material/Box';

import store from './app/store';
import theme from './theme';
import './i18n';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import ApplicationWizard from './pages/ApplicationWizard';
import SuccessPage from './pages/SuccessPage';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Utils
import { StorageService } from './utils/storage';
import { getLanguageDirection } from './utils/sitecoreContentHelper';
import i18n from './i18n';

// Create RTL cache for Arabic
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create LTR cache for English
const ltrCache = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer],
});

const App: React.FC = () => {
  // Handle initial language setup from storage
  useEffect(() => {
    const savedLang = StorageService.getLanguage();
    if (savedLang) {
      i18n.changeLanguage(savedLang);
      document.documentElement.dir = getLanguageDirection(savedLang);
      document.documentElement.lang = savedLang;
    }
  }, []);

  // Get current language direction
  const currentLang = i18n.language as 'en' | 'ar';
  const direction = getLanguageDirection(currentLang);

  // Select cache based on direction
  const cache = direction === 'rtl' ? rtlCache : ltrCache;

  return (
    <Provider store={store}>
      <CacheProvider value={cache}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
              dir={direction}
              lang={currentLang}
            >
              <Header />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<ApplicationWizard />} />
                  <Route path="/success" element={<SuccessPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={direction === 'rtl'}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ThemeProvider>
        </BrowserRouter>
      </CacheProvider>
    </Provider>
  );
};

export default App;