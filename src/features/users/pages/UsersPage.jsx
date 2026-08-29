import { useState, useEffect } from 'react'
import { useAuth } from '../../auth/useAuth.js'
import { AppError } from '../../../shared/api/errors.js'
import { getUsers } from '../userService.js'
import { toast } from 'sonner'
import UsersTable from '../components/UsersTable.jsx'
import { getRoles } from '../../roles/roleService.js'
/** @import { User,Role } from '../types.js' */
/** @import { Pagination } from '../../../shared/api/types.js' */

function UsersPage() {
  const [users, setUsers] = useState(/** @type {User[]} */ ([]))

  const [pagination, setPagination] = useState(
    /** @type {Pagination | null} */ (null),
  )
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sort, setSort] = useState('id')
  const { accessToken } = useAuth()
  const [role, setRole] = useState('')
  const [roles, setRoles] = useState(/** @type {Role[]} */ ([]))
  const [isActive, setIsActive] = useState('')
  const hasFilters = search !== '' || role !== '' || isActive !== ''
  useEffect(() => {
    async function loadRoles() {
      try {
        if (accessToken === null) return
        const data = await getRoles(accessToken)
        setRoles(data)
      } catch {
        toast.error('Could not fetch roles')
      }
    }
    loadRoles()
  }, [accessToken])
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [search])
  useEffect(() => {
    async function loadUsers() {
      try {
        if (accessToken === null) return
        setIsLoading(true)
        setError('')
        const data = await getUsers(
          {
            page,
            page_size: pageSize,
            search: debouncedSearch,
            sort,
            role: role || undefined,
            is_active: isActive === '' ? undefined : isActive === 'true',
          },
          accessToken,
        )
        setUsers(data.items)
        setPagination(data.pagination)
      } catch (e) {
        if (e instanceof AppError) {
          setError(e.message)
        } else {
          toast.error('Something went wrong. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadUsers()
  }, [accessToken, page, pageSize, debouncedSearch, isActive, role, sort])
  /**
   * @param {string} field
   */
  function handleSort(field) {
    setSort((current) => {
      if (current === field) {
        return `-${field}`
      }

      return field
    })

    setPage(1)
  }
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage application users and their access.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
            <input
              aria-label="Search users"
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search users..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
            />
            <label htmlFor="role-filter" className="sr-only">
              Filter by role
            </label>
            <select
              value={role}
              id="role-filter"
              onChange={(e) => {
                setRole(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
            >
              <option value="">All roles</option>

              {roles.map((roleOption) => (
                <option key={roleOption.id} value={roleOption.name}>
                  {roleOption.name}
                </option>
              ))}
            </select>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>

            <select
              id="status-filter"
              value={isActive}
              onChange={(e) => {
                setIsActive(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center gap-3 p-8 text-sm text-slate-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              <span>Loading users...</span>
            </div>
          )}
          {error && (
            <div className="p-8 text-center text-sm text-red-500">{error}</div>
          )}
          {!error && !isLoading && users.length === 0 && !hasFilters && (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                No users yet.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Users will appear here once accounts are created.
              </p>
            </div>
          )}
          {!error && !isLoading && users.length === 0 && hasFilters && (
            <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                No results
              </div>

              <p className="text-sm font-medium text-slate-700">
                No users found.
              </p>

              <p className="text-sm text-slate-500">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
          {!error && !isLoading && users.length > 0 && pagination !== null && (
            <>
              <UsersTable users={users} sort={sort} onSort={handleSort} />
              <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <label htmlFor="page-size" className="text-sm text-slate-500">
                    Rows per page:
                  </label>
                  <select
                    id="page-size"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setPage(1)
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>

                  <p className="text-sm text-slate-500">
                    {`Showing ${(page - 1) * pageSize + 1}–${Math.min(
                      page * pageSize,
                      pagination.total,
                    )} of ${pagination.total} · Page ${pagination.page} of ${
                      pagination.total_pages
                    }`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => current - 1)}
                    disabled={page <= 1}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={page >= pagination.total_pages}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersPage
