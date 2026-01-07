import { FC } from 'react'
import styles from './Widgets.module.scss'

export const Widgets: FC = () => {
  return (
    <div className={styles.widgets}>
      {/* Новые заявки */}
      <div className={styles.notifications}>
        <div className={styles.frame285}>
          <div className={styles.storage}>
            <div className={styles.menu}>
              <div className={styles.frame282}>
                <div className={styles.frame281}>
                  <svg className={styles.vector} width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.newRequests}>Новые заявки</span>
              </div>
              <div className={styles.frame283}>
                <span className={styles.count}>24</span>
                <svg className={styles.vector} width="8" height="4" viewBox="0 0 8 4" fill="none">
                  <path d="M0 4L4 0L8 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Поиск */}
      <div className={styles.search}>
        <div className={styles.input}>
          <div className={styles.field}>
            <div className={styles.left}>
              <div className={styles.placeholder}>Поиск</div>
              <svg className={styles.dropdown} width="8" height="4" viewBox="0 0 8 4" fill="none">
                <path d="M0 4L4 0L8 4" stroke="#979795" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Продвижение */}
      <div className={styles.promotion}>
        <div className={styles.promotionContent}>
          <div className={styles.promotionTitle}>Продвижение</div>
          <div className={styles.promotionDescription}>Информация о продвижении</div>
        </div>
      </div>

      {/* Тема */}
      <div className={styles.theme}>
        <div className={styles.themeContent}>
          <div className={styles.themeTitle}>Тема</div>
          <div className={styles.themeDescription}>Настройки темы</div>
        </div>
      </div>
    </div>
  )
}

