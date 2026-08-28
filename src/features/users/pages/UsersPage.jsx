import { useState } from 'react'
/** @import { User } from '../types.js' */
/** @import { Pagination } from '../../../shared/api/types.js' */

function UsersPage() {
  const [users, setUsers] = useState(/** @type {User[]} */ ([]))
  /** @type {Pagination | null} */
  const [pagination, setPagination] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  return <h1>Users</h1>
}

export default UsersPage
