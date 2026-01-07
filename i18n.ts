import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import EnCommon from './src/shared/assets/locales/en/common.json'
import EnDashboard from './src/shared/assets/locales/en/dashboard.json'
import EnUsers from './src/shared/assets/locales/en/users.json'
import EnSettings from './src/shared/assets/locales/en/settings.json'

import RuCommon from './src/shared/assets/locales/ru/common.json'
import RuDashboard from './src/shared/assets/locales/ru/dashboard.json'
import RuUsers from './src/shared/assets/locales/ru/users.json'
import RuSettings from './src/shared/assets/locales/ru/settings.json'

import {
  COMMON_NAMESPACE,
  DASHBOARD_NAMESPACE,
  USERS_NAMESPACE,
  SETTINGS_NAMESPACE,
} from './src/shared/constants/namespaces'

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language')
    if (savedLang === 'ru' || savedLang === 'en') {
      return savedLang
    }
  }
  return 'ru'
}

i18n
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: 'ru',
    debug: false,
    resources: {
      en: {
        [COMMON_NAMESPACE]: EnCommon,
        [DASHBOARD_NAMESPACE]: EnDashboard,
        [USERS_NAMESPACE]: EnUsers,
        [SETTINGS_NAMESPACE]: EnSettings,
      },
      ru: {
        [COMMON_NAMESPACE]: RuCommon,
        [DASHBOARD_NAMESPACE]: RuDashboard,
        [USERS_NAMESPACE]: RuUsers,
        [SETTINGS_NAMESPACE]: RuSettings,
      },
    },
    ns: [COMMON_NAMESPACE, DASHBOARD_NAMESPACE, USERS_NAMESPACE, SETTINGS_NAMESPACE],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  })

export default i18n

