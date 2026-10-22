import { useState, useEffect, useMemo, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { roleService } from '@/services/role.service'
import type { RightItem, Role, RoleTemplate } from '@/types/roles'

const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'faculty',
    title: 'Faculty',
    name: 'Faculty',
    description: 'Academic faculty member responsible for curriculum preparation, student mentoring, and resources',
    recommendedRights: [
      'batches.view',
      'study_material.view',
      'study_material.manage',
      'performance.view',
    ],
  },
  {
    id: 'hod',
    title: 'HOD',
    name: 'Head of Department (HOD)',
    description: 'Department head overseeing academic departments, learner cohorts, and performance analytics',
    recommendedRights: [
      'users.view',
      'batches.view',
      'batches.manage',
      'study_material.view',
      'study_material.manage',
      'performance.view',
      'performance.export',
    ],
  },
  {
    id: 'teacher',
    title: 'Teacher',
    name: 'Teacher',
    description: 'Classroom educator managing academic cohorts and study resources',
    recommendedRights: [
      'batches.view',
      'study_material.view',
      'performance.view',
    ],
  },
  {
    id: 'exam_admin',
    title: 'Exam Admin',
    name: 'Exam Admin',
    description: 'Extra administrator overseeing batch cohorts, materials, and learner performance',
    recommendedRights: [
      'batches.view',
      'batches.manage',
      'study_material.view',
      'performance.view',
      'performance.export',
    ],
  },
  {
    id: 'custom',
    title: 'Custom',
    name: '',
    description: '',
    recommendedRights: [],
  },
]

type RoleModalProps = {
  open: boolean
  onClose: () => void
  onSaved: (role: Role) => void
  role?: Role | null
  ceilingRights: RightItem[]
}

export function RoleModal({
  open,
  onClose,
  onSaved,
  role,
  ceilingRights,
}: RoleModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedRights, setSelectedRights] = useState<string[]>([])
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null)
  const [rightsFilterQuery, setRightsFilterQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = Boolean(role)

  const ceilingCodeSet = useMemo(() => {
    return new Set(ceilingRights.map((item) => item.code))
  }, [ceilingRights])

  useEffect(() => {
    if (open) {
      setError(null)
      setFieldErrors({})
      setActiveTemplateId(null)
      setRightsFilterQuery('')
      if (role) {
        setName(role.name)
        setDescription(role.description || '')
        const filteredRights = role.rights.filter((code) => ceilingCodeSet.has(code))
        setSelectedRights(filteredRights)
      } else {
        setName('')
        setDescription('')
        setSelectedRights([])
      }
    }
  }, [open, role, ceilingCodeSet])

  function handleApplyTemplate(template: RoleTemplate) {
    setActiveTemplateId(template.id)
    setName(template.name)
    setDescription(template.description)
    if (template.recommendedRights.length === 0) {
      setSelectedRights([])
    } else {
      const allowedRights = template.recommendedRights.filter((code) =>
        ceilingCodeSet.has(code),
      )
      setSelectedRights(allowedRights)
    }
    setFieldErrors((prev) => ({ ...prev, name: '' }))
  }

  const filteredCeilingRights = useMemo(() => {
    const query = rightsFilterQuery.trim().toLowerCase()
    if (!query) return ceilingRights
    return ceilingRights.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.module.toLowerCase().includes(query),
    )
  }, [ceilingRights, rightsFilterQuery])

  const groupedCeilingRights = useMemo(() => {
    const map = new Map<string, RightItem[]>()
    filteredCeilingRights.forEach((item) => {
      const list = map.get(item.module) || []
      list.push(item)
      map.set(item.module, list)
    })
    return Array.from(map.entries())
  }, [filteredCeilingRights])

  function handleToggleRight(code: string) {
    if (!ceilingCodeSet.has(code)) {
      return
    }

    setSelectedRights((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )
  }

  function handleSelectAllInModule(items: RightItem[]) {
    const validCodes = items.map((i) => i.code).filter((code) => ceilingCodeSet.has(code))
    setSelectedRights((prev) => {
      const merged = new Set([...prev, ...validCodes])
      return Array.from(merged)
    })
  }

  function handleDeselectAllInModule(items: RightItem[]) {
    const moduleCodes = new Set(items.map((i) => i.code))
    setSelectedRights((prev) => prev.filter((code) => !moduleCodes.has(code)))
  }

  function handleSelectAllCeiling() {
    setSelectedRights(ceilingRights.map((r) => r.code))
  }

  function handleClearAll() {
    setSelectedRights([])
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const trimmedName = name.trim()
    if (!trimmedName) {
      setFieldErrors({ name: 'Role name is required.' })
      return
    }

    const payloadRights = selectedRights.filter((code) => ceilingCodeSet.has(code))

    setIsSubmitting(true)

    try {
      if (isEdit && role) {
        const updated = await roleService.updateRole(role.id, {
          name: trimmedName,
          description: description.trim(),
          rights: payloadRights,
        })
        onSaved(updated)
      } else {
        const created = await roleService.createRole({
          name: trimmedName,
          description: description.trim(),
          role_type: 'dynamic',
          rights: payloadRights,
        })
        onSaved(created)
      }
      onClose()
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to save role.')
      setError(message)
      const mapped = getFieldErrors(err)
      if (Object.keys(mapped).length > 0) {
        setFieldErrors(mapped)
      }
      const dialogElement = (event.target as HTMLElement).closest('[role="dialog"]')
      if (dialogElement) {
        dialogElement.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Role' : 'Create Dynamic Role'}
      className="max-h-[92vh] max-w-2xl overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="error" title="Action Rejected">
            {error}
          </Alert>
        )}

        <div className="space-y-4">
          {!isEdit && (
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                Role Templates
              </span>
              <div className="flex flex-wrap gap-2">
                {ROLE_TEMPLATES.map((tmpl) => {
                  const isActive = activeTemplateId === tmpl.id
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        isActive
                          ? 'border border-primary bg-primary text-primary-foreground shadow-xs'
                          : 'border border-border/80 bg-surface text-foreground hover:border-primary-tint-4/80 hover:bg-surface-elevated'
                      }`}
                    >
                      {tmpl.title}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="role-name" className="block text-xs font-semibold text-foreground">
              Role Name <span className="text-danger">*</span>
            </label>
            <Input
              id="role-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setActiveTemplateId(null)
              }}
              placeholder="e.g. Senior Evaluator, Exam Admin, or Batch Mentor"
              className="mt-1"
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-danger">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="role-description" className="block text-xs font-semibold text-foreground">
              Description
            </label>
            <Input
              id="role-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope, department, or assigned responsibilities"
              className="mt-1"
            />
          </div>
        </div>

        <div className="rounded-card border border-border/80 bg-surface-elevated p-4 shadow-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground-strong">
                Organization Ceiling Rights
              </h3>
              <p className="text-xs text-muted">
                Only rights granted on the organization ceiling can be selected ({selectedRights.length} of {ceilingRights.length} selected).
              </p>
            </div>

            {ceilingRights.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllCeiling}
                  className="h-7 text-xs font-medium"
                >
                  Select all
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-7 text-xs font-medium"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {ceilingRights.length === 0 ? (
            <Alert variant="warning" className="mt-4 text-xs">
              No organization rights ceiling is currently active for this account. Roles cannot be granted rights outside the organization ceiling.
            </Alert>
          ) : (
            <div className="mt-4 space-y-3">
              {ceilingRights.length > 6 && (
                <div className="relative">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <Input
                    type="text"
                    placeholder="Filter ceiling rights..."
                    value={rightsFilterQuery}
                    onChange={(e) => setRightsFilterQuery(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
              )}

              {groupedCeilingRights.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted">
                  No rights match your search filter.
                </div>
              ) : (
                groupedCeilingRights.map(([moduleName, items]) => {
                  const allModuleSelected = items.every((i) => selectedRights.includes(i.code))
                  const someModuleSelected = items.some((i) => selectedRights.includes(i.code))
                  const selectedCount = items.filter((i) => selectedRights.includes(i.code)).length

                  return (
                    <div
                      key={moduleName}
                      className="rounded-control border border-border/70 bg-surface/50 p-3 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted">
                            {moduleName}
                          </span>
                          <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-semibold text-muted border border-border/60">
                            {selectedCount} of {items.length}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            allModuleSelected
                              ? handleDeselectAllInModule(items)
                              : handleSelectAllInModule(items)
                          }
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          {allModuleSelected
                            ? 'Deselect all'
                            : someModuleSelected
                              ? 'Select remaining'
                              : 'Select all'}
                        </button>
                      </div>

                      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                        {items.map((item) => {
                          const isChecked = selectedRights.includes(item.code)
                          return (
                            <label
                              key={item.code}
                              className={`flex cursor-pointer items-start gap-2.5 rounded-control border p-2.5 transition-all ${
                                isChecked
                                  ? 'border-primary-tint-4/80 bg-primary-soft/30 shadow-2xs'
                                  : 'border-border/60 bg-surface-elevated hover:border-primary-tint-4/50 hover:bg-surface/60'
                              }`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onChange={() => handleToggleRight(item.code)}
                                className="mt-0.5 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-foreground-strong">
                                    {item.label}
                                  </span>
                                </div>
                                <span className="block font-mono text-[10px] text-muted">
                                  {item.code}
                                </span>
                                {item.description && (
                                  <p className="mt-1 line-clamp-2 text-[11px] text-muted">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={ceilingRights.length === 0}
          >
            {isEdit ? 'Save Changes' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
