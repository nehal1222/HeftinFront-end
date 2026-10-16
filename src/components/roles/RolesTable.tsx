import { Lock, Pencil, Trash2 } from 'lucide-react'
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

function getRoleTypeBadge(roleType: Role['role_type'], isSystem?: boolean) {
  if (isSystem || roleType === 'system') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
        <Lock size={11} />
        System Role
      </span>
    )
  }

  if (roleType === 'extra_admin') {
    return (
      <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
        Extra Admin
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
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
      <div className="rounded-card border border-border bg-surface p-8 text-center">
        <p className="text-sm font-medium text-foreground">No roles found matching criteria.</p>
        <p className="mt-1 text-xs text-muted">Create a new dynamic role or adjust filters.</p>
      </div>
    )
  }

  return (
    <div className="rounded-card border border-border bg-surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Role Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Ceiling Rights</TableHead>
            <TableHead>Users</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => {
            const validCount = role.rights.filter((r) =>
              ceilingRights.some((cr) => cr.code === r),
            ).length
            const isSystemRole = Boolean(role.is_system || role.role_type === 'system')

            return (
              <TableRow key={role.id}>
                <TableCell>
                  <div>
                    <div className="font-semibold text-foreground-strong">
                      {role.name}
                    </div>
                    {role.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                        {role.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {getRoleTypeBadge(role.role_type, role.is_system)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">
                      {validCount} / {totalCeiling}
                    </span>
                    <div className="h-1.5 w-16 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${totalCeiling > 0 ? (validCount / totalCeiling) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted">
                    {role.users_count !== undefined ? role.users_count : 0} users
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {isSystemRole ? (
                      <span className="inline-flex items-center gap-1 text-xs text-muted px-2 py-1">
                        <Lock size={12} />
                        Locked
                      </span>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(role)}
                          className="h-8 px-2 text-foreground hover:text-primary"
                        >
                          <Pencil size={13} className="mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(role)}
                          className="h-8 px-2 text-danger hover:bg-red-50 hover:text-danger"
                        >
                          <Trash2 size={13} className="mr-1" />
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
