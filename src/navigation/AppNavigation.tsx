import { NavLink } from 'react-router-dom'
import { Building2, KeyRound, LayoutDashboard, Users } from 'lucide-react'
import { useAuth } from '@/contexts/useAuth'
import { ROUTES } from '@/lib/constants'
import { RIGHTS } from '@/lib/rights'
import type { RightCode } from '@/types/auth'

type NavItem = {
  label: string
  to: string
  icon: typeof LayoutDashboard
  requiredRight?: RightCode
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    to: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    to: ROUTES.USERS,
    icon: Users,
    requiredRight: RIGHTS.USERS_VIEW,
  },
  {
    label: 'Roles & rights',
    to: ROUTES.ROLES,
    icon: KeyRound,
    requiredRight: RIGHTS.ROLES_VIEW,
  },
  {
    label: 'Platform',
    to: ROUTES.PLATFORM,
    icon: Building2,
    requiredRight: RIGHTS.PLATFORM_VIEW,
  },
]

type AppNavigationProps = {
  includeDashboard?: boolean
  onNavigate?: () => void
}

export function AppNavigation({
  includeDashboard = true,
  onNavigate,
}: AppNavigationProps) {
  const { hasRight } = useAuth()

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!includeDashboard && item.to === ROUTES.DASHBOARD) return false
    return !item.requiredRight || hasRight(item.requiredRight)
  })

  return (
    <div className="space-y-1">
      {visibleItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:bg-surface hover:text-foreground',
              ].join(' ')
            }
          >
            <Icon size={17} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </div>
  )
}
