import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { Toaster } from 'sonner'
import { AuthProvider } from './features/auth/context/AuthProvider'
import AuthGate from './features/auth/components/AuthGate'
import { AppErrorBoundary } from './shared/components/errors/AppErrorBoundary'
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <Toaster />
        <AuthProvider>
          <AuthGate>
            <App />
          </AuthGate>
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
)
