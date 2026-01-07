import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin, useRegister } from '@/shared/api/users'
import { setTokens } from '@/shared/utils/auth'
import { AppRoutes } from '@/shared/constants/routes'
import { Input } from '@/shared/ui/Input/Input'
import styles from './Login.module.scss'

export const Login: FC = () => {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isRegisterMode) {
        const response = await registerMutation.mutateAsync({ email, password, name })
        if (response?.access_token && response?.refresh_token) {
          setTokens(response.access_token, response.refresh_token)
          navigate(AppRoutes.Dashboard)
        } else {
          setError('Неверный формат ответа от сервера')
        }
      } else {
        const response = await loginMutation.mutateAsync({ email, password })
        if (response?.access_token && response?.refresh_token) {
          setTokens(response.access_token, response.refresh_token)
          navigate(AppRoutes.Dashboard)
        } else {
          setError('Неверный формат ответа от сервера')
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      const errorMessage = 
        err?.response?.data?.error?.message || 
        err?.response?.data?.message || 
        err?.message || 
        'Ошибка входа'
      setError(errorMessage)
    }
  }

  const handleToggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setError('')
  }

  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>facebase</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegisterMode && (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="name-input">Имя</label>
              <Input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                required
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email-input">Почта</label>
            <Input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Пароль</label>
            <div className={styles.passwordWrapper}>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {showPassword ? (
                    <path d="M2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L17.1464 17.8536C17.3417 18.0488 17.6583 18.0488 17.8536 17.8536C18.0488 17.6583 18.0488 17.3417 17.8536 17.1464L2.85355 2.14645ZM10 4.5C6.41015 4.5 3.5 7.41015 3.5 11C3.5 12.4849 4.01875 13.8466 4.86413 14.9282L2.14645 17.6464C1.95118 17.8417 1.95118 18.1583 2.14645 18.3536C2.34171 18.5488 2.65829 18.5488 2.85355 18.3536L5.57123 15.6359C6.65284 16.4813 8.01449 17 9.5 17C13.0899 17 16 14.0899 16 10.5C16 9.01551 15.4813 7.65386 14.6359 6.57225L17.3536 3.85457C17.5488 3.65931 17.5488 3.34273 17.3536 3.14746C17.1583 2.9522 16.8417 2.9522 16.6464 3.14746L13.9287 6.86514C12.8471 6.01975 11.4849 5.5 10 5.5V4.5Z" fill="currentColor"/>
                  ) : (
                    <>
                      <path d="M10 4.5C6.41015 4.5 3.5 7.41015 3.5 11C3.5 12.4849 4.01875 13.8466 4.86413 14.9282L2.14645 17.6464C1.95118 17.8417 1.95118 18.1583 2.14645 18.3536C2.34171 18.5488 2.65829 18.5488 2.85355 18.3536L5.57123 15.6359C6.65284 16.4813 8.01449 17 9.5 17C13.0899 17 16 14.0899 16 10.5C16 9.01551 15.4813 7.65386 14.6359 6.57225L17.3536 3.85457C17.5488 3.65931 17.5488 3.34273 17.3536 3.14746C17.1583 2.9522 16.8417 2.9522 16.6464 3.14746L13.9287 6.86514C12.8471 6.01975 11.4849 5.5 10 5.5V4.5Z" fill="currentColor"/>
                      <circle cx="10" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending || registerMutation.isPending}
            className={styles.loginButton}
          >
            {loginMutation.isPending || registerMutation.isPending
              ? 'Загрузка...'
              : isRegisterMode
              ? 'Зарегистрироваться'
              : 'Авторизоваться'}
          </button>

          <button
            type="button"
            className={styles.registerButton}
            onClick={handleToggleMode}
          >
            {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </form>

        <div className={styles.footer}>
          <div className={styles.footerLink}>facebase.ru</div>
          <div className={styles.footerCopyright}>© 2024-2025, facebase</div>
        </div>
      </div>
    </div>
  )
}

