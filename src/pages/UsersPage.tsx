import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Search, RefreshCw, UserCheck, UserX, KeyRound } from 'lucide-react'
import { AppLayout } from '@/layouts/AppLayout'
import { AppNavigation } from '@/navigation/AppNavigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { userService } from '@/services/user.service'
import { roleService } from '@/services/role.service'
import { getErrorMessage } from '@/lib/axios'
import type { UserCreate, UserSummary } from '@/types/user'
import type { Role } from '@/types/roles'

export function UsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    display_name: '',
    email: '',
    password: '',
    mobile: '',
    employee_id: '',
    role_id: '',
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [confirmUser, setConfirmUser] = useState<{ user: UserSummary; action: 'activate' | 'deactivate' } | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setPageError(null)
    try {
      const [loadedUsers, loadedRoles] = await Promise.all([
        userService.listUsers(),
        roleService.getRoles().catch(() => []),
      ])
      setUsers(loadedUsers)
      setRoles(loadedRoles)
    } catch (err) {
      setPageError(getErrorMessage(err, 'Failed to load organization users.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return users.filter((user) => {
      const matchesStatus =
        statusFilter === 'all' || user.status.toLowerCase() === statusFilter
      const matchesQuery =
        !q ||
        user.display_name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.employee_id && user.employee_id.toLowerCase().includes(q))
      return matchesStatus && matchesQuery
    })
  }, [users, searchQuery, statusFilter])

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.display_name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      setCreateError('Full name, email, and password are required.')
      return
    }

    setCreateLoading(true)
    setCreateError(null)

    try {
      const payload: UserCreate = {
        display_name: createForm.display_name.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        mobile: createForm.mobile.trim() || null,
        employee_id: createForm.employee_id.trim() || null,
        role_id: createForm.role_id || null,
      }
      const created = await userService.createUser(payload)
      setUsers((prev) => [
        {
          id: created.id,
          email: created.email,
          display_name: created.display_name,
          employee_id: created.employee_id,
          status: created.status,
          role: created.role,
        },
        ...prev,
      ])
      setIsCreateModalOpen(false)
      setCreateForm({
        display_name: '',
        email: '',
        password: '',
        mobile: '',
        employee_id: '',
        role_id: '',
      })
      setActionSuccess(`User ${created.display_name} created successfully.`)
    } catch (err) {
      setCreateError(getErrorMessage(err, 'Failed to create user.'))
    } finally {
      setCreateLoading(false)
    }
  }

  async function handleToggleStatus() {
    if (!confirmUser) return
    const { user, action } = confirmUser

    try {
      if (action === 'activate') {
        await userService.activateUser(user.id)
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: 'active' } : u)),
        )
        setActionSuccess(`User ${user.display_name} activated successfully.`)
      } else {
        await userService.deactivateUser(user.id)
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: 'inactive' } : u)),
        )
        setActionSuccess(`User ${user.display_name} deactivated.`)
      }
      setConfirmUser(null)
    } catch (err) {
      setPageError(getErrorMessage(err, `Failed to ${action} user.`))
    }
  }

  async function handleSendResetLink(user: UserSummary) {
    try {
      await userService.sendResetLink(user.id)
      setActionSuccess(`Password reset email sent to ${user.email}.`)
    } catch (err) {
      setPageError(getErrorMessage(err, `Failed to send reset link to ${user.email}.`))
    }
  }

  return (
    <AppLayout nav={<AppNavigation />}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground-strong">
              Users & Members
            </h1>
            <p className="mt-1 text-sm text-muted">
              Manage organization learners, faculty evaluators, and staff accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadData()}
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCreateError(null)
                setIsCreateModalOpen(true)
              }}
            >
              <Plus size={16} />
              Add User
            </Button>
          </div>
        </div>

        {actionSuccess && (
          <div className="relative">
            <Alert variant="success">
              <div className="flex items-center justify-between">
                <span>{actionSuccess}</span>
                <button
                  type="button"
                  onClick={() => setActionSuccess(null)}
                  className="ml-4 font-semibold hover:opacity-80"
                >
                  ✕
                </button>
              </div>
            </Alert>
          </div>
        )}

        {pageError && (
          <div className="relative">
            <Alert variant="error">
              <div className="flex items-center justify-between">
                <span>{pageError}</span>
                <button
                  type="button"
                  onClick={() => setPageError(null)}
                  className="ml-4 font-semibold hover:opacity-80"
                >
                  ✕
                </button>
              </div>
            </Alert>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              placeholder="Search by name, email, or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
            {(['all', 'active', 'inactive'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === tab
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-semibold text-foreground-strong">
                No users found
              </p>
              <p className="mt-1 text-xs text-muted">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search query or status filter.'
                  : 'Start by provisioning your first organization member.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const isActive = user.status.toLowerCase() === 'active'
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {user.display_name}
                          </p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-muted">
                          {user.employee_id || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.role ? (
                          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {user.role.display_name || user.role.name}
                          </span>
                        ) : (
                          <span className="text-xs text-muted">No Role Assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-zinc-500/10 text-zinc-500'
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Send Password Reset"
                            onClick={() => void handleSendResetLink(user)}
                          >
                            <KeyRound size={14} />
                          </Button>
                          {isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-amber-600 hover:text-amber-700"
                              title="Deactivate User"
                              onClick={() =>
                                setConfirmUser({ user, action: 'deactivate' })
                              }
                            >
                              <UserX size={14} />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Activate User"
                              onClick={() =>
                                setConfirmUser({ user, action: 'activate' })
                              }
                            >
                              <UserCheck size={14} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground-strong">
              Create New User
            </h2>
            <p className="mt-1 text-xs text-muted">
              Add a new staff, faculty, or student account to this organization.
            </p>

            {createError && (
              <div className="mt-4">
                <Alert variant="error">{createError}</Alert>
              </div>
            )}

            <form onSubmit={(e) => void handleCreateUser(e)} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Full Name *
                </label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Jane Doe"
                  value={createForm.display_name}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, display_name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Email Address *
                </label>
                <Input
                  type="email"
                  className="mt-1"
                  placeholder="e.g. jane@institution.edu"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Temporary Password *
                </label>
                <Input
                  type="password"
                  className="mt-1"
                  placeholder="Minimum 8 characters"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, password: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Mobile
                  </label>
                  <Input
                    className="mt-1"
                    placeholder="+91..."
                    value={createForm.mobile}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, mobile: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Employee / Roll ID
                  </label>
                  <Input
                    className="mt-1"
                    placeholder="EMP-102"
                    value={createForm.employee_id}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, employee_id: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Assigned Role
                </label>
                <select
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={createForm.role_id}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, role_id: e.target.value }))
                  }
                >
                  <option value="">No Role (Default Learner)</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.role_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={createLoading}>
                  {createLoading ? <Spinner size="sm" /> : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmUser && (
        <ConfirmDialog
          open={true}
          title={`${confirmUser.action === 'activate' ? 'Activate' : 'Deactivate'} User`}
          message={`Are you sure you want to ${confirmUser.action} ${confirmUser.user.display_name} (${confirmUser.user.email})?`}
          confirmText={confirmUser.action === 'activate' ? 'Activate' : 'Deactivate'}
          confirmVariant={confirmUser.action === 'activate' ? 'primary' : 'danger'}
          onConfirm={() => void handleToggleStatus()}
          onClose={() => setConfirmUser(null)}
        />
      )}
    </AppLayout>
  )
}
