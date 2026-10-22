import { Lock, Pencil, Shield, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import type { RightItem, Role } from '@/types/roles'

type RolesTableProps = {
  roles: Role[]
  ceilingRights: RightItem[]
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

function getRoleBadge(role: Role) {
  if (role.role_type === 'org_admin') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800">
        <Lock size={10} className="shrink-0" />
        Org Admin (System)
      </span>
    )
  }

  if (role.role_type === 'student') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
        <Lock size={10} className="shrink-0" />
        Student (System)
      </span>
    )
  }

  const name = role.name.toLowerCase()

  if (name.includes('faculty')) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
        Faculty
      </span>
    )
  }

  if (name.includes('hod') || name.includes('head of department')) {
    return (
      <span className="inline-flex items-center rounded-full border border-purple-200/80 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
        HOD
      </span>
    )
  }

  if (name.includes('teacher')) {
    return (
      <span className="inline-flex items-center rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
        Teacher
      </span>
    )
  }

  if (name.includes('exam admin')) {
    return (
      <span className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
        Exam Admin
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full border border-primary-tint-4/60 bg-primary-soft/40 px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
      Dynamic Role
    </span>
  )
}

export function RolesTable({
  roles,
  ceilingRights,
  onEdit,
  onDelete,
}: RolesTableProps) {
  const totalCeiling = ceilingRights.length

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-border/80 bg-surface-elevated py-12 px-4 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft/50 text-primary">
          <Shield size={22} />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-foreground-strong">
          No organization roles found
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted">
          No roles match your search or filter. Create a new dynamic role or reset the filter to view all roles.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-card border border-border/80 bg-surface-elevated shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/70 bg-surface/50 text-xs font-semibold uppercase tracking-wider text-muted">
            <TableHead className="w-[32%] py-3">Role Details</TableHead>
            <TableHead className="py-3">Role Classification</TableHead>
            <TableHead className="py-3">Ceiling Allocation</TableHead>
            <TableHead className="py-3">Members</TableHead>
            <TableHead className="py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => {
            const isOrgAdmin = role.role_type === 'org_admin'
            const validCount = isOrgAdmin
              ? totalCeiling
              : (role.rights || []).filter((r) =>
                  ceilingRights.some((cr) => cr.code === r),
                ).length
            const isSystemRole = Boolean(
              role.is_system || role.role_type === 'org_admin' || role.role_type === 'student',
            )
            const percentage = totalCeiling > 0 ? Math.round((validCount / totalCeiling) * 100) : 0

            return (
              <TableRow
                key={role.id}
                className="border-b border-border/50 transition-colors hover:bg-surface/40"
              >
                <TableCell className="py-3.5">
                  <div>
                    <div className="font-semibold text-sm text-foreground-strong">
                      {role.name}
                    </div>
                    {role.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                        {role.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  {getRoleBadge(role)}
                </TableCell>

                <TableCell className="py-3.5">
                  <div className="flex flex-col gap-1.5 sm:w-36">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {isOrgAdmin ? 'Full Ceiling' : `${validCount} of ${totalCeiling}`}
                      </span>
                      <span className="font-mono text-[11px] text-muted">
                        {isOrgAdmin ? '100%' : `${percentage}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/70">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${isOrgAdmin ? 100 : percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Users size={13} className="shrink-0 text-muted/80" />
                    <span className="font-medium text-foreground">
                      {role.users_count !== undefined ? role.users_count : 0}
                    </span>
                    <span>members</span>
                  </div>
                </TableCell>

                <TableCell className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isSystemRole ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-control bg-surface px-2.5 py-1 text-xs font-medium text-muted"
                        title="System roles are fixed and cannot be modified"
                      >
                        <Lock size={11} className="shrink-0" />
                        Locked
                      </span>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(role)}
                          className="h-8 px-2.5 text-xs font-medium text-foreground hover:bg-surface hover:text-primary"
                        >
                          <Pencil size={12} className="mr-1 shrink-0" />
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(role)}
                          className="h-8 px-2.5 text-xs font-medium text-danger hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 size={12} className="mr-1 shrink-0" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
