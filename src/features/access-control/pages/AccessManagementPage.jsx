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
  const canCreateRole = hasPermission(user, 'role.create')
  const canEditRole = hasPermission(user, 'role.update')
  const canDeleteRole = hasPermission(user, 'role.delete')
  const canCreatePermission = hasPermission(user, 'permission.create')
  const canEditPermission = hasPermission(user, 'permission.update')
  const canDeletePermission = hasPermission(user, 'permission.delete')
  const canAssignPermissions = hasPermission(user, 'role.assign_permission')
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
    async function loadPermissions() {
      try {
        if (accessToken === null) return
        const data = await getPermissions(accessToken)
        setPermissions(data)
      } catch {
        toast.error('Could not fetch roles')
      }
    }
    loadPermissions()
  }, [accessToken])

  const selectedRole = roles.find((role) => role.id === selectedRoleId)
  const assignedPermissions = selectedRole?.permissions

  const availablePermissions = permissions.filter(
    (permission) =>
      !assignedPermissions?.some((assigned) => assigned.id === permission.id),
  )

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

                    <div className="max-h-[28vh] space-y-2 overflow-y-auto pr-1">
                      {assignedPermissions?.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            {permission.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {permission.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">
                      Available · {availablePermissions.length}
                    </h3>
                    <div className="max-h-[28vh] space-y-2 overflow-y-auto pr-1">
                      {availablePermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            {permission.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {permission.description}
                          </p>
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
