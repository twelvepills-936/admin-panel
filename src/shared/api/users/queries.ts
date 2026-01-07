import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { $api } from '../config'
import {
  IUser,
  ICreateUserDto,
  IUpdateUserDto,
  ILoginDto,
  IRegisterDto,
  IAuthResponse,
  IRefreshTokenResponse,
  IApiResponse,
} from './types'

// API функции
export const getUsers = async (params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<{ data: IUser[]; total: number }> => {
  const { data } = await $api.get<IApiResponse<{ data: IUser[]; total: number; page: number; limit: number; total_pages: number }>>('/v1/users', {
    params,
  })
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Failed to fetch users')
  }
  // Бэкенд возвращает { data: { data: [...], total, page, limit, total_pages } }
  return {
    data: data.data.data || [],
    total: data.data.total || 0,
  }
}

export const getUser = async (id: string): Promise<IUser> => {
  const { data } = await $api.get<IApiResponse<IUser>>(`/v1/users/${id}`)
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Failed to fetch user')
  }
  return data.data
}

export const createUser = async (userData: ICreateUserDto): Promise<IUser> => {
  const { data } = await $api.post<IApiResponse<IUser>>('/v1/users', userData)
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Failed to create user')
  }
  return data.data
}

export const updateUser = async (id: string, userData: IUpdateUserDto): Promise<IUser> => {
  const { data } = await $api.put<IApiResponse<IUser>>(`/v1/users/${id}`, userData)
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Failed to update user')
  }
  return data.data
}

export const deleteUser = async (id: string): Promise<void> => {
  const { data } = await $api.delete<IApiResponse<void>>(`/v1/users/${id}`)
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to delete user')
  }
}

export const login = async (credentials: ILoginDto): Promise<IAuthResponse> => {
  const { data } = await $api.post<IApiResponse<IAuthResponse>>('/v1/auth/login', credentials)
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Login failed')
  }
  return data.data
}

export const register = async (userData: IRegisterDto): Promise<IAuthResponse> => {
  const { data } = await $api.post<IApiResponse<IAuthResponse>>('/v1/auth/register', userData)
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Registration failed')
  }
  return data.data
}

export const refreshToken = async (refreshToken: string): Promise<IRefreshTokenResponse> => {
  const { data } = await $api.post<IApiResponse<IRefreshTokenResponse>>('/v1/auth/refresh', {
    refresh_token: refreshToken,
  })
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Token refresh failed')
  }
  return data.data
}

export const logout = async (refreshToken: string): Promise<void> => {
  const { data } = await $api.post<IApiResponse<void>>('/v1/auth/logout', {
    refresh_token: refreshToken,
  })
  if (!data.success) {
    throw new Error(data.error?.message || 'Logout failed')
  }
}

export const getCurrentUser = async (): Promise<IUser> => {
  const { data } = await $api.get<IApiResponse<IUser>>('/v1/auth/me')
  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Failed to get current user')
  }
  return data.data
}

// React Query хуки
export const useUsers = (params?: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateUserDto }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  })
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshToken,
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!localStorage.getItem('auth_token'),
  })
}

