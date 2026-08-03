import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { Toaster } from 'sonner'
import App from '@/App'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import '@/i18n'
import '@/index.css'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <Toaster position="bottom-center" theme="dark" richColors />
  </StrictMode>,
)
