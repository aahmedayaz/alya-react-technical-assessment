import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/library/tokens.css'
import './styles/globals.css'
import App from './App.tsx'
import { ThemeProvider, ToastProvider } from './contexts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
