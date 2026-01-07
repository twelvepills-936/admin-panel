const ACCESS_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Получение access token из localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

// Получение refresh token из localStorage
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// Сохранение access token
export function setAuthToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

// Сохранение refresh token
export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

// Сохранение обоих токенов
export function setTokens(accessToken: string, refreshToken: string): void {
  setAuthToken(accessToken)
  setRefreshToken(refreshToken)
}

// Удаление токенов
export function removeTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// Получение заголовков авторизации
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  
  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

// Проверка авторизации
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

