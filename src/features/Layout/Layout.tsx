import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Widgets } from './components/Widgets/Widgets'
import styles from './Layout.module.scss'

export const Layout: FC = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
      <Widgets />
    </div>
  )
}

