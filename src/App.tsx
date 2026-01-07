import { QueryProvider } from './providers/QueryProvider/QueryProvider'
import { I18nextProvider } from 'react-i18next'
import { RoutesConfig } from './pages/RoutesConfig'
import i18n from '../i18n'
import { COMMON_NAMESPACE } from './shared/constants/namespaces'
import '@scss/variables.scss'
import './App.scss'

export function App() {
  return (
    <QueryProvider>
      <I18nextProvider defaultNS={COMMON_NAMESPACE} i18n={i18n}>
        <RoutesConfig />
      </I18nextProvider>
    </QueryProvider>
  )
}

