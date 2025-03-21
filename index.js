// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Tailwind or custom styles
import App from './App.js';  // Import App.js
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* Make sure this is rendering the App component */}
  </React.StrictMode>
);

reportWebVitals();




