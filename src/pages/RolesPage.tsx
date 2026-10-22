import { useState, useEffect, useMemo, useCallback } from 'react'
import { Plus, Search, RefreshCw, AlertTriangle } from 'lucide-react'
import { AppLayout } from '@/layouts/AppLayout'
import { AppNavigation } from '@/navigation/AppNavigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Spinner } from '@/components/ui/Spinner'
import { CeilingSummaryCard } from '@/components/roles/CeilingSummaryCard'
import { RolesTable } from '@/components/roles/RolesTable'
import { RoleModal } from '@/components/roles/RoleModal'
import { roleService } from '@/services/role.service'
import { getErrorMessage } from '@/lib/axios'
import type { RightItem, Role } from '@/types/roles'

export function RolesPage() {
  const [ceilingRights, setCeilingRights] = useState<RightItem[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'dynamic' | 'system'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setPageError(null)
    try {
      const [ceiling, loadedRoles] = await Promise.all([
        roleService.getOrganizationCeiling(),
        roleService.getRoles(),
      ])
      setCeilingRights(ceiling)
      setRoles(loadedRoles)
    } catch (err) {
      setPageError(getErrorMessage(err, 'Failed to load organization roles or ceiling rights.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const filteredRoles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return roles.filter((role) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'dynamic' && role.role_type === 'dynamic') ||
        (activeTab === 'system' && (role.role_type === 'org_admin' || role.role_type === 'student' || role.is_system))

      const matchesQuery =
        !query ||
        role.name.toLowerCase().includes(query) ||
        (role.description && role.description.toLowerCase().includes(query))

      return matchesTab && matchesQuery
    })
  }, [roles, activeTab, searchQuery])

  function handleOpenCreate() {
    setEditingRole(null)
    setIsModalOpen(true)
  }

  function handleOpenEdit(role: Role) {
    setEditingRole(role)
    setIsModalOpen(true)
  }

  function handleRoleSaved(savedRole: Role) {
    setRoles((prev) => {
      const exists = prev.some((r) => r.id === savedRole.id)
      if (exists) {
        return prev.map((r) => (r.id === savedRole.id ? savedRole : r))
      }
      return [savedRole, ...prev]
    })
  }

  function handleRequestDelete(role: Role) {
    setDeleteError(null)
    setDeletingRole(role)
  }

  async function handleConfirmDelete() {
    if (!deletingRole) return
    setDeleteError(null)
    try {
      await roleService.deleteRole(deletingRole.id)
      setRoles((prev) => prev.filter((r) => r.id !== deletingRole.id))
      setDeletingRole(null)
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'Failed to delete role.'))
    }
  }

  const isCeilingEmpty = !isLoading && !pageError && ceilingRights.length === 0

  return (
    <AppLayout nav={<AppNavigation />}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground-strong">
              Roles & Rights
            </h1>
            <p className="text-xs text-muted">
              Configure dynamic roles and delegate permissions strictly within the organization ceiling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadData()}
              disabled={isLoading}
              title="Refresh roles"
              className="h-9 w-9 p-0"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleOpenCreate}
              disabled={isLoading || isCeilingEmpty}
            >
              <Plus size={15} className="mr-1.5 shrink-0" />
              Create Role
            </Button>
          </div>
        </div>

        {pageError && (
          <Alert variant="error" title="Error Loading Roles">
            <div className="flex items-center justify-between gap-4">
              <span>{pageError}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadData()}
              >
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {isCeilingEmpty && (
          <Alert variant="warning" title="No Organization Ceiling Granted">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                This organization does not currently have any rights granted in its ceiling. Dynamic roles cannot be created or assigned rights until a ceiling is granted by the platform administrator.
              </span>
            </div>
          </Alert>
        )}

        {deleteError && (
          <Alert variant="error" title="Deletion Rejected">
            {deleteError}
          </Alert>
        )}

        <CeilingSummaryCard
          ceilingRights={ceilingRights}
          roles={roles}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1 rounded-control border border-border/80 bg-surface/70 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span>All roles</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === 'all'
                    ? 'bg-primary-shade-1 text-primary-foreground'
                    : 'bg-border/60 text-muted'
                }`}
              >
                {roles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dynamic')}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'dynamic'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span>Dynamic roles</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === 'dynamic'
                    ? 'bg-primary-shade-1 text-primary-foreground'
                    : 'bg-border/60 text-muted'
                }`}
              >
                {roles.filter((r) => r.role_type === 'dynamic').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'system'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span>System roles</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === 'system'
                    ? 'bg-primary-shade-1 text-primary-foreground'
                    : 'bg-border/60 text-muted'
                }`}
              >
                {roles.filter((r) => r.role_type === 'org_admin' || r.role_type === 'student' || r.is_system).length}
              </span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-xs"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-card border border-border/80 bg-surface-elevated py-16 shadow-xs">
            <Spinner size="md" className="mr-2.5 text-primary" />
            <span className="text-xs font-medium text-muted">Loading organization roles and ceiling...</span>
          </div>
        ) : (
          <RolesTable
            roles={filteredRoles}
            ceilingRights={ceilingRights}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
          />
        )}

        <RoleModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingRole(null)
          }}
          onSaved={handleRoleSaved}
          role={editingRole}
          ceilingRights={ceilingRights}
        />

        <ConfirmDialog
          open={Boolean(deletingRole)}
          onClose={() => setDeletingRole(null)}
          onConfirm={() => void handleConfirmDelete()}
          title="Delete Role"
          message={`Are you sure you want to delete the role "${deletingRole?.name}"? Users assigned to this role will lose its attached rights.`}
          confirmText="Delete Role"
          confirmVariant="danger"
        />
      </div>
    </AppLayout>
  )
}
