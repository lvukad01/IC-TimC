<<<<<<< HEAD
import ReactDom from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

const root = ReactDom.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
>>>>>>> origin/home-screen
);
