import { Shield, ShieldAlert, KeyRound, Users, UserCheck } from 'lucide-react'
import type { RightItem, Role } from '@/types/roles'

type CeilingSummaryCardProps = {
  ceilingRights: RightItem[]
  roles: Role[]
}

export function CeilingSummaryCard({
  ceilingRights,
  roles,
}: CeilingSummaryCardProps) {
  const dynamicRolesCount = roles.filter((r) => r.role_type === 'dynamic').length
  const systemRolesCount = roles.filter((r) => r.role_type === 'org_admin' || r.role_type === 'student').length
  const totalAssignedUsers = roles.reduce((acc, r) => acc + (r.users_count || 0), 0)
  const isCeilingActive = ceilingRights.length > 0

  return (
    <div className="rounded-card border border-border bg-surface-elevated p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {isCeilingActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-0.5 text-caption font-semibold text-primary-dark">
                <Shield size={12} />
                Organization Ceiling Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-0.5 text-caption font-semibold text-yellow-800">
                <ShieldAlert size={12} />
                No Ceiling Granted
              </span>
            )}
          </div>

          <h2 className="mt-2 text-heading-sm font-semibold text-foreground-strong">
            Tenant Rights Ceiling & Delegation
          </h2>

          <p className="mt-1 text-sm text-muted">
            Heftin Admin grants the account rights ceiling. Org Admin can define dynamic roles and attach any subset of these granted rights.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-control border border-border bg-surface p-3">
          <div className="flex items-center gap-2 text-muted">
            <KeyRound size={15} />
            <span className="text-xs font-medium">Ceiling Rights</span>
          </div>
          <p className="mt-1 font-display text-heading-md font-bold text-foreground-strong">
            {ceilingRights.length}
          </p>
          <p className="text-[11px] text-muted">Codes permitted</p>
        </div>

        <div className="rounded-control border border-border bg-surface p-3">
          <div className="flex items-center gap-2 text-muted">
            <Users size={15} />
            <span className="text-xs font-medium">Dynamic Roles</span>
          </div>
          <p className="mt-1 font-display text-heading-md font-bold text-foreground-strong">
            {dynamicRolesCount}
          </p>
          <p className="text-[11px] text-muted">Tenant custom roles</p>
        </div>

        <div className="rounded-control border border-border bg-surface p-3">
          <div className="flex items-center gap-2 text-muted">
            <UserCheck size={15} />
            <span className="text-xs font-medium">System Roles</span>
          </div>
          <p className="mt-1 font-display text-heading-md font-bold text-foreground-strong">
            {systemRolesCount}
          </p>
          <p className="text-[11px] text-muted">Org Admin & Student</p>
        </div>

        <div className="rounded-control border border-border bg-surface p-3">
          <div className="flex items-center gap-2 text-muted">
            <Users size={15} />
            <span className="text-xs font-medium">Total Users</span>
          </div>
          <p className="mt-1 font-display text-heading-md font-bold text-foreground-strong">
            {totalAssignedUsers}
          </p>
          <p className="text-[11px] text-muted">Assigned members</p>
        </div>
      </div>
    </div>
  )
}
