import { useState, useEffect, useCallback } from 'react'
import { Plus, RefreshCw, Building2, CheckCircle2, XCircle, Shield } from 'lucide-react'
import { AppLayout } from '@/layouts/AppLayout'
import { AppNavigation } from '@/navigation/AppNavigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { organizationService } from '@/services/organization.service'
import { catalogService } from '@/services/catalog.service'
import { getErrorMessage } from '@/lib/axios'
import type { OrganizationOut, OrgCreate, CeilingOut } from '@/types/organization'
import type { ModuleOut } from '@/types/catalog'

export function PlatformPage() {
  const [orgs, setOrgs] = useState<OrganizationOut[]>([])
  const [modules, setModules] = useState<ModuleOut[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    slug: '',
    org_type: 'academic',
    admin_email: '',
    admin_name: '',
    admin_password: '',
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [ceilingModalOrg, setCeilingModalOrg] = useState<OrganizationOut | null>(null)
  const [ceilingData, setCeilingData] = useState<CeilingOut | null>(null)
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [ceilingLoading, setCeilingLoading] = useState(false)
  const [ceilingSaving, setCeilingSaving] = useState(false)
  const [ceilingError, setCeilingError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setPageError(null)
    try {
      const [loadedOrgs, loadedModules] = await Promise.all([
        organizationService.listOrgs(),
        catalogService.listModules().catch(() => []),
      ])
      setOrgs(loadedOrgs)
      setModules(loadedModules)
    } catch (err) {
      setPageError(getErrorMessage(err, 'Failed to load organizations.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.name.trim() || !createForm.slug.trim() || !createForm.admin_email.trim() || !createForm.admin_password.trim()) {
      setCreateError('Organization name, slug, admin email, and admin password are required.')
      return
    }

    setCreateLoading(true)
    setCreateError(null)

    try {
      const payload: OrgCreate = {
        name: createForm.name.trim(),
        slug: createForm.slug.trim().toLowerCase(),
        org_type: createForm.org_type,
        org_admin: {
          email: createForm.admin_email.trim(),
          display_name: createForm.admin_name.trim() || createForm.name.trim() + ' Admin',
          password: createForm.admin_password,
        },
      }
      const created = await organizationService.createOrg(payload)
      setOrgs((prev) => [created, ...prev])
      setIsCreateModalOpen(false)
      setCreateForm({
        name: '',
        slug: '',
        org_type: 'academic',
        admin_email: '',
        admin_name: '',
        admin_password: '',
      })
      setActionSuccess(`Organization ${created.name} created successfully.`)
    } catch (err) {
      setCreateError(getErrorMessage(err, 'Failed to create organization.'))
    } finally {
      setCreateLoading(false)
    }
  }

  async function handleOpenCeilingModal(org: OrganizationOut) {
    setCeilingModalOrg(org)
    setCeilingLoading(true)
    setCeilingError(null)
    try {
      const ceiling = await organizationService.getCeiling(org.id)
      setCeilingData(ceiling)
      setSelectedModules(ceiling.modules || [])
    } catch (err) {
      setCeilingError(getErrorMessage(err, 'Failed to load ceiling for this organization.'))
    } finally {
      setCeilingLoading(false)
    }
  }

  async function handleSaveCeiling() {
    if (!ceilingModalOrg || !ceilingData) return
    setCeilingSaving(true)
    setCeilingError(null)
    try {
      const updated = await organizationService.replaceCeiling(ceilingModalOrg.id, {
        expected_revision: ceilingData.revision,
        modules: selectedModules,
      })
      setCeilingData(updated)
      setCeilingModalOrg(null)
      setActionSuccess(`Ceiling updated for ${ceilingModalOrg.name}.`)
      void loadData()
    } catch (err) {
      setCeilingError(getErrorMessage(err, 'Failed to update organization ceiling.'))
    } finally {
      setCeilingSaving(false)
    }
  }

  async function handleToggleOrgStatus(org: OrganizationOut) {
    try {
      if (org.is_active) {
        const updated = await organizationService.deactivateOrg(org.id)
        setOrgs((prev) => prev.map((o) => (o.id === org.id ? updated : o)))
        setActionSuccess(`Organization ${org.name} deactivated.`)
      } else {
        const updated = await organizationService.activateOrg(org.id)
        setOrgs((prev) => prev.map((o) => (o.id === org.id ? updated : o)))
        setActionSuccess(`Organization ${org.name} activated.`)
      }
    } catch (err) {
      setPageError(getErrorMessage(err, 'Failed to update organization status.'))
    }
  }

  return (
    <AppLayout nav={<AppNavigation />}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground-strong">
              Platform Administration
            </h1>
            <p className="mt-1 text-sm text-muted">
              Heftin SuperAdmin portal: client organizations, tenant provisioning, and access ceilings.
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
              Create Organization
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

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : orgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 size={32} className="text-muted" />
              <p className="mt-2 text-sm font-semibold text-foreground-strong">
                No organizations provisioned
              </p>
              <p className="mt-1 text-xs text-muted">
                Create your first tenant client organization to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Ceiling Revision</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {org.name}
                        </p>
                        <p className="font-mono text-xs text-muted">{org.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-muted">{org.slug}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold capitalize text-foreground">
                        {org.org_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-foreground">
                        v{org.ceiling_revision}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          org.is_active
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-zinc-500/10 text-zinc-500'
                        }`}
                      >
                        {org.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleOpenCeilingModal(org)}
                        >
                          <Shield size={14} />
                          Edit Ceiling
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void handleToggleOrgStatus(org)}
                        >
                          {org.is_active ? (
                            <XCircle size={14} className="text-amber-600" />
                          ) : (
                            <CheckCircle2 size={14} className="text-emerald-600" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground-strong">
              Create Client Organization
            </h2>
            <p className="mt-1 text-xs text-muted">
              Provision a new client tenant and its initial Primary Org Admin.
            </p>

            {createError && (
              <div className="mt-4">
                <Alert variant="error">{createError}</Alert>
              </div>
            )}

            <form onSubmit={(e) => void handleCreateOrg(e)} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Organization Name *
                </label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Acme Civil Academy"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Slug (Subdomain key) *
                </label>
                <Input
                  className="mt-1"
                  placeholder="e.g. acme-academy"
                  value={createForm.slug}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, slug: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Organization Type
                </label>
                <select
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={createForm.org_type}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, org_type: e.target.value }))
                  }
                >
                  <option value="academic">Academic Institution</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="individual">Individual</option>
                  <option value="trial">Trial / Demo</option>
                </select>
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-xs font-semibold text-foreground-strong">
                  Primary Org Admin Account
                </p>
                <div className="mt-2 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Admin Email *
                    </label>
                    <Input
                      type="email"
                      className="mt-1"
                      placeholder="admin@acme.edu"
                      value={createForm.admin_email}
                      onChange={(e) =>
                        setCreateForm((p) => ({ ...p, admin_email: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Admin Password *
                    </label>
                    <Input
                      type="password"
                      className="mt-1"
                      placeholder="Initial secure password"
                      value={createForm.admin_password}
                      onChange={(e) =>
                        setCreateForm((p) => ({ ...p, admin_password: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
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
                  {createLoading ? <Spinner size="sm" /> : 'Create Organization'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ceilingModalOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground-strong">
              Ceiling Access: {ceilingModalOrg.name}
            </h2>
            <p className="mt-1 text-xs text-muted">
              Grant or revoke platform capability modules onto this organization account.
            </p>

            {ceilingError && (
              <div className="mt-4">
                <Alert variant="error">{ceilingError}</Alert>
              </div>
            )}

            {ceilingLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Spinner size="md" />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs font-semibold text-foreground">
                  Allowed Capability Modules:
                </p>
                <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-border bg-surface p-3">
                  {(modules.length > 0
                    ? modules.map((m) => m.code)
                    : ['exams', 'study_material', 'performance', 'users', 'roles', 'batches', 'evaluations']
                  ).map((modCode) => {
                    const isChecked = selectedModules.includes(modCode)
                    return (
                      <label
                        key={modCode}
                        className="flex cursor-pointer items-center justify-between rounded p-1.5 hover:bg-card"
                      >
                        <span className="font-mono text-sm font-medium text-foreground">
                          {modCode}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedModules((prev) => [...prev, modCode])
                            } else {
                              setSelectedModules((prev) =>
                                prev.filter((m) => m !== modCode),
                              )
                            }
                          }}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                      </label>
                    )
                  })}
                </div>
                <p className="text-xs text-muted">
                  Current Ceiling Revision: v{ceilingData?.revision ?? 1}
                </p>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCeilingModalOrg(null)}
                    disabled={ceilingSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => void handleSaveCeiling()}
                    disabled={ceilingSaving}
                  >
                    {ceilingSaving ? <Spinner size="sm" /> : 'Save Ceiling'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
