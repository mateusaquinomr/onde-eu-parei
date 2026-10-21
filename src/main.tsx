import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './app/providers';

import "./styles/reset.css";
import "./styles/global.css";
import "./styles/tokens/colors.css";
import "./styles/tokens/blur.css";
import "./styles/tokens/spacing.css";
import "./styles/tokens/radius.css";
import "./styles/tokens/typography.css";
import "./styles/tokens/shadows.css";
import "./styles/tokens/transition.css";
import "./styles/theme.css";
import "./styles/semantic/action.css";
import "./styles/semantic/form.css";
import "./styles/semantic/feedback.css";
import "./styles/semantic/surface.css";
import "./styles/semantic/input.css";
import "./styles/semantic/text.css";

import App from "./app/App";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);