import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '@/shared/utils/auth'
import { AppRoutes } from '@/shared/constants/routes'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to={AppRoutes.Login} replace />
  }

  return <>{children}</>
}

