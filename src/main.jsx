import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import LandingPage from './components/LandingPage.jsx';

function Root() {
  const [entered, setEntered] = useState(false);

  return entered
    ? <App />
    : <LandingPage onEnter={() => setEntered(true)} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);