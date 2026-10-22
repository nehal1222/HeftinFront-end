import { KeyRound, Shield, ShieldAlert, UserCheck, Users } from 'lucide-react'
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
    <div className="rounded-card border border-border/70 bg-surface-elevated p-5 shadow-xs transition-shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
                isCeilingActive
                  ? 'border border-primary-tint-4/60 bg-primary-soft/40 text-primary-dark'
                  : 'border border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                {isCeilingActive && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                    isCeilingActive ? 'bg-primary' : 'bg-amber-600'
                  }`}
                />
              </span>
              {isCeilingActive ? (
                <>
                  <Shield size={12} className="shrink-0" />
                  Ceiling Active
                </>
              ) : (
                <>
                  <ShieldAlert size={12} className="shrink-0" />
                  Ceiling Pending
                </>
              )}
            </span>
          </div>

          <h2 className="text-base font-semibold tracking-tight text-foreground-strong">
            Tenant Rights Ceiling & Delegation
          </h2>

          <p className="text-xs text-muted">
            Heftin Admin grants the account ceiling. Org Admin can provision dynamic roles within these permitted codes.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-control border border-border/60 bg-surface/60 p-3 transition-colors hover:border-primary-tint-4/80">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium">Ceiling Rights</span>
            <KeyRound size={15} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground-strong">
            {ceilingRights.length}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">Permitted codes</p>
        </div>

        <div className="rounded-control border border-border/60 bg-surface/60 p-3 transition-colors hover:border-primary-tint-4/80">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium">Dynamic Roles</span>
            <Users size={15} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground-strong">
            {dynamicRolesCount}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">Tenant custom roles</p>
        </div>

        <div className="rounded-control border border-border/60 bg-surface/60 p-3 transition-colors hover:border-primary-tint-4/80">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium">System Roles</span>
            <UserCheck size={15} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground-strong">
            {systemRolesCount}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">Org Admin & Student</p>
        </div>

        <div className="rounded-control border border-border/60 bg-surface/60 p-3 transition-colors hover:border-primary-tint-4/80">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium">Assigned Users</span>
            <Users size={15} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground-strong">
            {totalAssignedUsers}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">Active members</p>
        </div>
      </div>
    </div>
  )
}
