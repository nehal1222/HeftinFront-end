import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import type { RightCode } from '@/types/auth'

type NavItem = {
  label: string
  to: string
  requiredRight?: RightCode
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    to: ROUTES.DASHBOARD,
  },
 {
  label: 'Users',
  to: ROUTES.USERS,
  requiredRight: 'users.view',
},
  {
    label: 'Roles',
    to: ROUTES.ROLES,
    requiredRight: 'roles.view',
  },
]

export function AppNavigation() {
  const { hasRight } = useAuth()

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.requiredRight || hasRight(item.requiredRight),
  )

  return (
    <div className="space-y-1">
      {visibleItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            [
              'block rounded-control px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-surface-muted',
            ].join(' ')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
