import React from 'react';
import ReactDOM from 'react-dom/client';

import ThemeProvider from './components/ThemeProvider.jsx';
import { Toaster } from './components/ui/toaster.jsx';
import Router from './Router.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <Router />
    <Toaster />
  </ThemeProvider>,
);
