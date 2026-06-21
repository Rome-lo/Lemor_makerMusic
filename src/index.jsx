import React from 'react';
import ReactDOM from 'react-dom/client';
import { StudioProvider } from './store/StudioContext';
import App from './App';
import 'react-tooltip/dist/react-tooltip.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StudioProvider>
      <App />
    </StudioProvider>
  </React.StrictMode>,
);
