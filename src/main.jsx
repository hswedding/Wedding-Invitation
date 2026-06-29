import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { inject } from '@vercel/analytics';
import 'react-phone-number-input/style.css';
import './styles/base.css';
import './styles/components.css';
import App from './App.jsx';

inject();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
