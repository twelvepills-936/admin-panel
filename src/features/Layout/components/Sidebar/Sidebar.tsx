import { FC, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppRoutes } from '@/shared/constants/routes'
import { useTranslation } from 'react-i18next'
import { COMMON_NAMESPACE } from '@/shared/constants/namespaces'
import classNames from 'classnames'
import styles from './Sidebar.module.scss'

export const Sidebar: FC = () => {
  const location = useLocation()
  const { t } = useTranslation(COMMON_NAMESPACE)
  const [isStorageExpanded, setIsStorageExpanded] = useState(false)

  const menuItems = [
    { path: AppRoutes.Dashboard, label: 'Бренды', icon: 'brands', tabWidth: 64 },
    { path: '/bloggers', label: 'Блогеры', icon: 'bloggers', tabWidth: 69 },
    { path: '/integrations', label: 'Интеграции', icon: 'integrations', tabWidth: 88 },
  ]

  const storageSubItems = [
    { path: AppRoutes.Users, label: 'Пользователи', icon: 'users' },
    { path: AppRoutes.Settings, label: 'Настройки', icon: 'settings' },
  ]

  const isActive = (path: string) => {
    if (path === AppRoutes.Dashboard) {
      return location.pathname === AppRoutes.Dashboard
    }
    return location.pathname.startsWith(path)
  }

  const isStorageActive = storageSubItems.some(item => isActive(item.path))

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>facebase</div>
        </div>
        
        <nav className={styles.menu}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={classNames(styles.menuItem, {
                [styles.active]: isActive(item.path),
              })}
            >
              <div className={styles.tabWrapper} style={{ width: `${item.tabWidth}px` }}>
                <div className={styles.icon}>
                  {item.icon === 'brands' && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ position: 'absolute', left: 'calc(50% - 12px/2)', top: 'calc(50% - 10px/2)' }}>
                      <path d="M1 1L6 5.5L11 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {item.icon === 'bloggers' && (
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" style={{ position: 'absolute', left: 'calc(50% - 12px/2)', top: 'calc(50% - 11px/2 - 0.5px)' }}>
                      <circle cx="6" cy="3" r="2" stroke="currentColor" strokeWidth="1"/>
                      <path d="M2 9C2 7 4 5.5 6 5.5C8 5.5 10 7 10 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  )}
                  {item.icon === 'integrations' && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: 'absolute', left: 'calc(50% - 10px/2)', top: 'calc(50% - 10px/2)' }}>
                      <path d="M1 1L5 5L9 1M1 5L5 9L9 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={styles.name}>{item.label}</span>
              </div>
              <div className={styles.spacer}></div>
              <div className={styles.text}></div>
            </Link>
          ))}

          {/* Хранилище с подменю */}
          <div className={classNames(styles.storageMenuItem, {
            [styles.active]: isStorageActive,
            [styles.expanded]: isStorageExpanded,
          })}>
            <button
              className={styles.storageButton}
              onClick={() => setIsStorageExpanded(!isStorageExpanded)}
            >
              <div className={styles.tabWrapper} style={{ width: '88px' }}>
                <div className={styles.icon}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: 'absolute', left: 'calc(50% - 10px/2)', top: 'calc(50% - 10px/2)' }}>
                    <rect x="1" y="2" width="8" height="7" rx="0.5" stroke="currentColor" strokeWidth="1"/>
                    <path d="M3 2V1C3 0.5 3.5 0 4 0H6C6.5 0 7 0.5 7 1V2" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
                <span className={styles.name}>Хранилище</span>
              </div>
              <div className={styles.spacer}></div>
              <div className={styles.expandIcon}>
                <svg 
                  width="8" 
                  height="4" 
                  viewBox="0 0 8 4" 
                  fill="none"
                  style={{ 
                    transform: isStorageExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                >
                  <path d="M0 4L4 0L8 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            {isStorageExpanded && (
              <div className={styles.subMenu}>
                {storageSubItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={classNames(styles.subMenuItem, {
                      [styles.active]: isActive(item.path),
                    })}
                  >
                    <div className={styles.tabWrapper} style={{ width: 'auto' }}>
                      <div className={styles.icon}>
                        {item.icon === 'users' && (
                          <svg width="12" height="11" viewBox="0 0 12 11" fill="none" style={{ position: 'absolute', left: 'calc(50% - 12px/2)', top: 'calc(50% - 11px/2 - 0.5px)' }}>
                            <circle cx="6" cy="3" r="2" stroke="currentColor" strokeWidth="1"/>
                            <path d="M2 9C2 7 4 5.5 6 5.5C8 5.5 10 7 10 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        )}
                        {item.icon === 'settings' && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: 'absolute', left: 'calc(50% - 10px/2)', top: 'calc(50% - 10px/2)' }}>
                            <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1"/>
                            <path d="M5 0.5V2M5 8V9.5M9.5 5H8M2 5H0.5M8.5 1.5L7.5 2.5M2.5 7.5L1.5 8.5M8.5 8.5L7.5 7.5M2.5 2.5L1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>
                      <span className={styles.name}>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Рассылка */}
          <Link
            to="/mailing"
            className={classNames(styles.menuItem, {
              [styles.active]: location.pathname === '/mailing',
            })}
          >
            <div className={styles.tabWrapper} style={{ width: '74px' }}>
              <div className={styles.icon}>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ position: 'absolute', left: 'calc(50% - 12px/2)', top: 'calc(50% - 10px/2)' }}>
                  <path d="M1 1L6 5L11 1M1 5L6 9L11 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.name}>Рассылка</span>
            </div>
            <div className={styles.spacer}></div>
            <div className={styles.text}></div>
          </Link>
        </nav>
      </div>

      <div className={styles.settings}>
        <div className={styles.settingsItem}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}></div>
            <span className={styles.userName}>Никита</span>
          </div>
          <div className={styles.settingsIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 1V3M8 13V15M15 8H13M3 8H1M13.5 2.5L12 4M4 12L2.5 13.5M13.5 13.5L12 12M4 4L2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </aside>
  )
}

