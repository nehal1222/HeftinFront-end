import { useState, useEffect, useMemo, type FormEvent } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { roleService } from '@/services/role.service'
import type { RightItem, Role } from '@/types/roles'

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
  const [roleType, setRoleType] = useState<'dynamic' | 'extra_admin'>('dynamic')
  const [selectedRights, setSelectedRights] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tamperSimulation, setTamperSimulation] = useState(false)

  const isEdit = Boolean(role)

  const ceilingCodeSet = useMemo(() => {
    return new Set(ceilingRights.map((item) => item.code))
  }, [ceilingRights])

  useEffect(() => {
    if (open) {
      setError(null)
      setFieldErrors({})
      setTamperSimulation(false)
      if (role) {
        setName(role.name)
        setDescription(role.description || '')
        setRoleType(role.role_type === 'extra_admin' ? 'extra_admin' : 'dynamic')
        const filteredRights = role.rights.filter((code) => ceilingCodeSet.has(code))
        setSelectedRights(filteredRights)
      } else {
        setName('')
        setDescription('')
        setRoleType('dynamic')
        setSelectedRights([])
      }
    }
  }, [open, role, ceilingCodeSet])

  const groupedCeilingRights = useMemo(() => {
    const map = new Map<string, RightItem[]>()
    ceilingRights.forEach((item) => {
      const list = map.get(item.module) || []
      list.push(item)
      map.set(item.module, list)
    })
    return Array.from(map.entries())
  }, [ceilingRights])

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

    const payloadRights = tamperSimulation
      ? [...selectedRights, 'platform.superadmin.unauthorized']
      : selectedRights.filter((code) => ceilingCodeSet.has(code))

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
          role_type: roleType,
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
      title={isEdit ? 'Edit Role' : 'Create New Role'}
      className="max-h-[90vh] max-w-2xl overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="error" title="Action Rejected">
            {error}
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="role-name" className="block text-sm font-medium text-foreground">
              Role name <span className="text-danger">*</span>
            </label>
            <Input
              id="role-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Senior Evaluator or Exam Admin"
              className="mt-1"
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-danger">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="role-description" className="block text-sm font-medium text-foreground">
              Description
            </label>
            <Input
              id="role-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Responsibilities, scope, or batch assignment details"
              className="mt-1"
            />
          </div>

          {!isEdit && (
            <div>
              <label htmlFor="role-type" className="block text-sm font-medium text-foreground">
                Role type
              </label>
              <Select
                id="role-type"
                value={roleType}
                onChange={(e) => setRoleType(e.target.value as 'dynamic' | 'extra_admin')}
                className="mt-1"
              >
                <option value="dynamic">Dynamic Role (Faculty, Evaluators, Mentors)</option>
                <option value="extra_admin">Extra Admin (Delegated Administration)</option>
              </Select>
              <p className="mt-1 text-xs text-muted">
                Extra admins receive elevated management abilities within the selected ceiling subset.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface-elevated p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground-strong">
                Organization Ceiling Rights
              </h3>
              <p className="text-xs text-muted">
                Only rights granted on the organization ceiling can be selected ({selectedRights.length} of {ceilingRights.length} selected).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAllCeiling}
              >
                Select all
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
              >
                Clear all
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {groupedCeilingRights.map(([moduleName, items]) => {
              const allModuleSelected = items.every((i) => selectedRights.includes(i.code))
              const someModuleSelected = items.some((i) => selectedRights.includes(i.code))

              return (
                <div key={moduleName} className="rounded-control border border-border bg-surface p-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      {moduleName}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        allModuleSelected
                          ? handleDeselectAllInModule(items)
                          : handleSelectAllInModule(items)
                      }
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {allModuleSelected ? 'Deselect all' : someModuleSelected ? 'Select remaining' : 'Select all'}
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {items.map((item) => {
                      const isChecked = selectedRights.includes(item.code)
                      return (
                        <label
                          key={item.code}
                          className={`flex cursor-pointer items-start gap-2.5 rounded-control border p-2.5 transition-colors ${
                            isChecked
                              ? 'border-primary-tint-4 bg-primary-soft/50'
                              : 'border-border bg-surface-elevated hover:bg-surface'
                          }`}
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggleRight(item.code)}
                            className="mt-0.5"
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
            })}
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted hover:text-foreground">
              <Checkbox
                checked={tamperSimulation}
                onChange={(e) => setTamperSimulation(e.target.checked)}
              />
              <span>Simulate out-of-ceiling code submission (tamper test)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
          >
            {isEdit ? 'Save Changes' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
