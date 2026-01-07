import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from '@/features/ErrorBoundary/ErrorBoundary'
import { ErrorBlock } from '@/features/ErrorBoundary/components/ErrorBlock/ErrorBlock'
import { App } from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={ErrorBlock}>
      <App />
    </ErrorBoundary>
  </StrictMode>
)

