import { FC } from 'react'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/features/Layout/Layout'
import { AppRoutes } from '@/shared/constants/routes'
import { Dashboard } from './Dashboard/Dashboard'
import { Bloggers } from './Bloggers/Bloggers'
import { Users } from './Users/Users'
import { Settings } from './Settings/Settings'
import { Login } from './Login/Login'
import { ProtectedRoute } from '@/features/Auth/ProtectedRoute'

const routes = createBrowserRouter([
  {
    path: AppRoutes.Login,
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: AppRoutes.Dashboard,
        element: <Dashboard />,
      },
      {
        path: '/bloggers',
        element: <Bloggers />,
      },
      {
        path: AppRoutes.Users,
        element: <Users />,
      },
      {
        path: AppRoutes.Settings,
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={AppRoutes.Dashboard} />,
  },
])

export const RoutesConfig: FC = () => {
  return <RouterProvider router={routes} />
}

