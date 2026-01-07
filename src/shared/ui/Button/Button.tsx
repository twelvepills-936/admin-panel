import { ButtonHTMLAttributes, FC } from 'react'
import classNames from 'classnames'
import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Загрузка...' : children}
    </button>
  )
}

