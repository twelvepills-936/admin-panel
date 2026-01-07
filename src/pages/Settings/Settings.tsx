import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SETTINGS_NAMESPACE } from '@/shared/constants/namespaces'
import styles from './Settings.module.scss'

export const Settings: FC = () => {
  const { t, i18n } = useTranslation(SETTINGS_NAMESPACE)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>{t('title')}</h1>
      
      <div className={styles.section}>
        <h2>{t('language')}</h2>
        <button onClick={toggleLanguage} className={styles.languageButton}>
          {i18n.language === 'ru' ? 'English' : 'Русский'}
        </button>
      </div>
    </div>
  )
}

