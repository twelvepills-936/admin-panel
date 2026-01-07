import { FC } from 'react'
import styles from './ErrorBlock.module.scss'

interface ErrorBlockProps {
  error?: Error
}

export const ErrorBlock: FC<ErrorBlockProps> = ({ error }) => {
  return (
    <div className={styles.errorBlock}>
      <h1>Что-то пошло не так</h1>
      <p>{error?.message || 'Произошла непредвиденная ошибка'}</p>
      <button onClick={() => window.location.reload()}>
        Перезагрузить страницу
      </button>
    </div>
  )
}

