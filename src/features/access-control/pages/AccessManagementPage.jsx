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

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {roles.map((role) => (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50">
                <p>{role.name}</p>
                <p>{role.description}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {permissions.map((permission) => (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <p>{permission.name}</p>
                <p>{permission.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
export default AccessManagementPage
