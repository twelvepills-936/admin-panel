import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers, useDeleteUser } from '@/shared/api/users'
import { AppRoutes } from '@/shared/constants/routes'
import { Button } from '@/shared/ui/Button/Button'
import { Loader } from '@/shared/ui/Loader/Loader'
import { useTranslation } from 'react-i18next'
import { USERS_NAMESPACE, COMMON_NAMESPACE } from '@/shared/constants/namespaces'
import styles from './Users.module.scss'

export const Users: FC = () => {
  const { t: tUsers } = useTranslation(USERS_NAMESPACE)
  const { t: tCommon } = useTranslation(COMMON_NAMESPACE)
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  
  const { data, isLoading, error } = useUsers({ page, limit: 10, search })
  const deleteUserMutation = useDeleteUser()

  const handleDelete = async (id: string) => {
    if (window.confirm(tCommon('confirmDelete'))) {
      try {
        await deleteUserMutation.mutateAsync(id)
      } catch (err) {
        console.error('Ошибка удаления пользователя:', err)
      }
    }
  }

  if (isLoading) return <Loader />
  if (error) return <div className={styles.error}>{tUsers('error')}</div>

  return (
    <div className={styles.users}>
      <div className={styles.header}>
        <h1>{tUsers('title')}</h1>
        <Button onClick={() => navigate(AppRoutes.UsersCreate)}>
          {tUsers('createUser')}
        </Button>
      </div>

      <div className={styles.search}>
        <input
          type="text"
          placeholder={tUsers('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {data?.data.length === 0 ? (
        <div className={styles.empty}>{tUsers('noUsers')}</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>{tCommon('name')}</th>
                <th>{tCommon('email')}</th>
                <th>{tCommon('role')}</th>
                <th>{tCommon('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((user) => (
                <tr key={user._id}>
                  <td>{user._id.slice(0, 8)}...</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{tCommon(user.role)}</td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => navigate(AppRoutes.UsersEdit.replace(':id', user._id))}
                      >
                        {tCommon('edit')}
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(user._id)}
                        isLoading={deleteUserMutation.isPending}
                      >
                        {tCommon('delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

