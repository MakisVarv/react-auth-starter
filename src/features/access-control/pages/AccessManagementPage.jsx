import { useState, useEffect } from 'react'
import { useAuth } from '../../auth/useAuth.js'
import { AppError } from '../../../shared/api/errors.js'
import { toast } from 'sonner'

import {
  getRoles,
  getRole,
  createRole,
  editRole,
  deleteRole,
  addPermissionToRole,
  removePermissionFromRole,
} from '../../roles/roleService'
import {
  getPermissions,
  getPermission,
  createPermission,
  editPermission,
  deletePermission,
} from '../../permissions/permissionsService'
import { hasPermission } from '../../auth/permissions.js'

/** @import { Role } from '../../roles/types.js' */
/** @import { Permission } from '../../permissions/types.js' */

function AccessManagementPage() {
  const { user, accessToken } = useAuth()
  const [roles, setRoles] = useState(/** @type {Role[]} */ ([]))
  const [permissions, setPermissions] = useState(
    /** @type {Permission[]} */ ([]),
  )
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [updatingPermissionId, setUpdatingPermissionId] = useState('')
  const canCreateRole = hasPermission(user, 'role.create')
  const canEditRole = hasPermission(user, 'role.update')
  const canDeleteRole = hasPermission(user, 'role.delete')
  const canCreatePermission = hasPermission(user, 'permission.create')
  const canEditPermission = hasPermission(user, 'permission.update')
  const canDeletePermission = hasPermission(user, 'permission.delete')
  const canAssignPermissions = hasPermission(user, 'role.assign_permission')
  useEffect(() => {
    async function loadAccessData() {
      try {
        if (accessToken === null) return
        setIsLoading(true)
        setError('')
        const [rolesData, permissionsData] = await Promise.all([
          getRoles(accessToken),
          getPermissions(accessToken),
        ])
        setRoles(rolesData)
        setPermissions(permissionsData)
      } catch (e) {
        if (e instanceof AppError) {
          setError(e.message)
        } else {
          setError('Could not fetch role/permission data!')
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadAccessData()
  }, [accessToken])

  /**
   * @param {string} permissionId
   */
  async function addPermission(permissionId) {
    try {
      if (accessToken === null) return
      setUpdatingPermissionId(permissionId)
      const updatedRole = await addPermissionToRole(
        selectedRoleId,
        permissionId,
        accessToken,
      )
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === updatedRole.id ? updatedRole : role,
        ),
      )
    } catch (e) {
      if (e instanceof AppError) {
        toast.error(e.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setUpdatingPermissionId('')
    }
  }
  /**
   * @param {string} permissionId
   */
  async function removePermission(permissionId) {
    try {
      if (accessToken === null) return
      setUpdatingPermissionId(permissionId)
      const updatedRole = await removePermissionFromRole(
        selectedRoleId,
        permissionId,
        accessToken,
      )
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === updatedRole.id ? updatedRole : role,
        ),
      )
    } catch (e) {
      if (e instanceof AppError) {
        toast.error(e.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setUpdatingPermissionId('')
    }
  }

  const selectedRole = roles.find((role) => role.id === selectedRoleId)
  const assignedPermissions = selectedRole?.permissions

  const availablePermissions = permissions.filter(
    (permission) =>
      !assignedPermissions?.some((assigned) => assigned.id === permission.id),
  )
  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-sm text-slate-500">Loading access management...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Access Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage roles and their assigned permissions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Roles</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a role to manage its permissions.
                </p>
              </div>
              <div className="space-y-2 p-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRoleId(role.id)}
                    className={` overflow-hidden w-full rounded-xl border px-4 py-3 text-left transition 
                    ${selectedRoleId === role.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50 bg-white'}`}
                  >
                    <p className="font-medium text-slate-900">{role.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {role.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>
          {selectedRole != null && (
            <div>
              <section className=" overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Permissions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Permissions for {selectedRole.name}
                  </p>
                </div>
                <div className="space-y-6 p-4">
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">
                      Assigned · {assignedPermissions?.length ?? 0}
                    </h3>

                    <div className="max-h-[28vh] space-y-1.5 overflow-y-auto pr-1">
                      {assignedPermissions?.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-1.5 gap-3"
                        >
                          <div className="overflow-hidden w-full text-left">
                            <p className="text-sm font-medium text-slate-900">
                              {permission.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {permission.description}
                            </p>
                          </div>

                          {canAssignPermissions && (
                            <button
                              disabled={updatingPermissionId === permission.id}
                              onClick={() => removePermission(permission.id)}
                              aria-label="Remove permission from role"
                              title="Remove permission"
                              type="button"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-lg font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">
                      Available · {availablePermissions.length}
                    </h3>
                    <div className="max-h-[28vh] space-y-1.5 overflow-y-auto pr-1">
                      {availablePermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-1.5 gap-3"
                        >
                          <div className="overflow-hidden w-full text-left">
                            <p className="text-sm font-medium text-slate-900">
                              {permission.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {permission.description}
                            </p>
                          </div>
                          {canAssignPermissions && (
                            <button
                              disabled={updatingPermissionId === permission.id}
                              type="button"
                              onClick={() => addPermission(permission.id)}
                              aria-label="Add permission to role"
                              title="Add permission"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-lg font-semibold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              +
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AccessManagementPage
