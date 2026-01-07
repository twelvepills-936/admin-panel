import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { removeTokens } from '@/shared/utils/auth'
import { AppRoutes } from '@/shared/constants/routes'
import { COMMON_NAMESPACE } from '@/shared/constants/namespaces'
import { Button } from '@/shared/ui/Button/Button'
import styles from './Header.module.scss'

export const Header: FC = () => {
  const { t, i18n } = useTranslation(COMMON_NAMESPACE)
  const navigate = useNavigate()

  const handleLogout = () => {
    removeTokens()
    navigate(AppRoutes.Login)
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.actions}>
          <Button size="small" variant="secondary" onClick={toggleLanguage}>
            {i18n.language === 'ru' ? 'EN' : 'RU'}
          </Button>
          <Button size="small" variant="secondary" onClick={handleLogout}>
            {t('logout')}
          </Button>
        </div>
      </div>
    </header>
  )
}

