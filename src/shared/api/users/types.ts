export interface IUser {
  id: string
  email: string
  name: string
  phone?: string | null
  role: string
  status: string
  is_email_verified: boolean
  created_at: string
  updated_at: string
}

export interface ICreateUserDto {
  email: string
  name: string
  password: string
  role?: 'admin' | 'user' | 'moderator'
}

export interface IUpdateUserDto {
  email?: string
  name?: string
  password?: string
  role?: 'admin' | 'user' | 'moderator'
}

export interface ILoginDto {
  email: string
  password: string
}

export interface IRegisterDto {
  email: string
  password: string
  name: string
}

export interface IAuthResponse {
  access_token: string
  refresh_token: string
  admin: IUser
}

export interface IRefreshTokenResponse {
  access_token: string
}

export interface IApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

