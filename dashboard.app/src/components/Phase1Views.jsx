import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BATCHES, DEPARTMENTS, DEMO_ORGANIZATION, ORGANIZATION_CEILING, PEOPLE, RECENT_ACTIVITY, ROLE_DEFINITIONS } from '../data/mockAuth.js'
import { RIGHT_CODES } from '../types/auth.js'
import { canAccessScope, hasRight, isPlatformAdmin } from '../utils/rights.js'

const RIGHT_GROUPS = [
  ['Users', 'users.'],
  ['Roles', 'roles.'],
  ['Departments', 'departments.'],
  ['Batches', 'batches.'],
  ['Organization', 'org.profile.'],
  ['Audit', 'audit.'],
]

const RIGHT_LABELS = {
  'users.view': 'View users',
  'users.create': 'Create users',
  'users.edit': 'Edit users',
  'users.deactivate': 'Deactivate users',
  'users.reset_password': 'Reset passwords',
  'roles.view': 'View roles',
  'roles.create': 'Create roles',
  'roles.edit': 'Edit roles',
  'roles.delete': 'Delete roles',
  'roles.rights.edit': 'Edit role rights',
  'roles.assign': 'Assign roles',
  'org.profile.view': 'View organization profile',
  'org.profile.edit': 'Edit organization profile',
  'audit.view': 'View audit log',
  'departments.view': 'View departments',
  'departments.create': 'Create departments',
  'departments.edit': 'Edit departments',
  'batches.view': 'View batches',
  'batches.create': 'Create batches',
  'batches.edit': 'Edit batches',
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <header className="phase-page-heading">
      <div>
        <span className="phase-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  )
}

function EmptyState({ title, description }) {
  return (
    <div className="phase-empty" role="status">
      <span className="phase-empty-mark">0</span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

function Metric({ label, value, note, tone = 'teal' }) {
  return (
    <motion.article
      className={`phase-metric phase-metric-${tone}`}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </motion.article>
  )
}

function scopeDescription(scopes) {
  const labels = scopes.map((scope) => {
    if (scope.type === 'batch') return BATCHES.find((batch) => batch.id === scope.id)?.name ?? scope.id
    if (scope.type === 'department') return DEPARTMENTS.find((department) => department.id === scope.id)?.name ?? scope.id
    return `${scope.type} ${scope.id}`
  })
  return `Showing ${labels.join(', ')} only`
}

function personMatchesScopes(person, scopes) {
  return scopes.some(
    (scope) =>
      (scope.type === 'batch' && scope.id === person.batchId) ||
      (scope.type === 'department' && scope.id === person.departmentId)
  )
}

/* ==========================================================================
   DESIGN A — ORGANIZATION ADMIN DASHBOARD
   ========================================================================== */
export function OrganizationDashboard({ auth, navigate }) {
  const isScoped = !isPlatformAdmin(auth.profile) && auth.profile.scopes.length > 0
  const scopedPeople = isScoped ? PEOPLE.filter((person) => personMatchesScopes(person, auth.profile.scopes)) : null
  const greetingName = auth.profile.display_name?.split(' ')[0] || (isPlatformAdmin(auth.profile) ? 'Admin' : 'Nehal')

  const quickLinks = [
    { label: 'People', path: '/people', right: 'users.view', detail: 'Directory and assignments' },
    { label: 'Roles', path: '/roles', right: 'roles.view', detail: 'Organization-defined access' },
    { label: 'Departments', path: '/departments', right: 'departments.view', detail: 'Academic structure' },
    { label: 'Batches', path: '/batches', right: 'batches.view', detail: 'Cohorts and assigned scope' },
    { label: 'Audit', path: '/audit', right: 'audit.view', detail: 'Access audit trail' },
    { label: 'Organization', path: '/organization', right: 'org.profile.view', detail: 'Tenant profile & ceiling' },
  ].filter((item) => hasRight(auth.profile.rights, item.right))

  return (
    <>
      <PageHeading
        eyebrow={isPlatformAdmin(auth.profile) ? 'PLATFORM ADMINISTRATION' : 'ORGANIZATION DASHBOARD'}
        title={`Good morning, ${greetingName}`}
        description={
          isScoped
            ? `Your access is scoped to ${scopeDescription(auth.profile.scopes).replace('Showing ', '').replace(' only', '')}.`
            : 'Access-controlled workspace powered by server-computed effective rights.'
        }
      />

      {isScoped && (
        <div className="phase-scope-notice">
          <span className="phase-scope-dot" /> {scopeDescription(auth.profile.scopes)}
        </div>
      )}

      {/* Metric Cards */}
      <section className="phase-metrics" aria-label="Organization summary">
        <Metric
          label="People"
          value={isScoped ? scopedPeople.length : DEMO_ORGANIZATION.peopleCount}
          note={isScoped ? 'Within assigned scope' : 'Organization-wide'}
        />
        <Metric
          label="Roles"
          value={isScoped ? '—' : DEMO_ORGANIZATION.roleCount}
          note={isScoped ? 'Organization-managed' : 'Organization-defined'}
          tone="blue"
        />
        <Metric
          label="Rights"
          value={auth.profile.rights.length}
          note="Active effective rights"
          tone="green"
        />
        <Metric
          label="Departments"
          value={isScoped ? '—' : DEMO_ORGANIZATION.departmentCount}
          note={isScoped ? 'Organization-managed' : 'Active departments'}
          tone="amber"
        />
      </section>

      {/* Main Grid: Organization Card + Recent Activity */}
      <section className="phase-dashboard-grid">
        <article className="phase-panel phase-overview-panel">
          <div className="phase-panel-heading">
            <div>
              <span className="phase-eyebrow">ORGANIZATION</span>
              <h2>{isPlatformAdmin(auth.profile) ? 'Heftin Platform Central' : DEMO_ORGANIZATION.name}</h2>
            </div>
            <span className="phase-status">
              <i />
              {isPlatformAdmin(auth.profile) ? 'Platform Admin' : DEMO_ORGANIZATION.status}
            </span>
          </div>

          <div className="phase-org-facts">
            <div>
              <span>Location</span>
              <strong>{DEMO_ORGANIZATION.city}</strong>
            </div>
            <div>
              <span>Departments</span>
              <strong>{DEMO_ORGANIZATION.departmentCount} active</strong>
            </div>
            <div>
              <span>Batches</span>
              <strong>{DEMO_ORGANIZATION.batchCount} active</strong>
            </div>
            <div>
              <span>Assigned Role</span>
              <strong>{auth.profile.role ?? 'Platform SuperAdmin'}</strong>
            </div>
          </div>

          {!quickLinks.length ? (
            <EmptyState
              title="No organization rights assigned"
              description="Contact your organization administrator to assign role access."
            />
          ) : (
            <div className="phase-quick-links">
              {quickLinks.map((item) => (
                <button key={item.path} type="button" onClick={() => navigate(item.path)}>
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <b aria-hidden="true">→</b>
                </button>
              ))}
            </div>
          )}
        </article>

        <article className="phase-panel phase-activity-panel">
          <div className="phase-panel-heading">
            <div>
              <span className="phase-eyebrow">AUDIT TRAIL</span>
              <h2>Recent activity</h2>
            </div>
            <button className="phase-text-button" type="button" onClick={() => navigate('/audit')}>
              View all
            </button>
          </div>

          {hasRight(auth.profile.rights, 'audit.view') || isPlatformAdmin(auth.profile) ? (
            <div className="phase-activity-list">
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.action} className="phase-activity-item">
                  <span className="phase-activity-line" />
                  <div>
                    <strong>{item.action}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <time>{item.time}</time>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Audit restricted"
              description="Your current role does not have audit.view permissions."
            />
          )}
        </article>
      </section>
    </>
  )
}

/* ==========================================================================
   ORGANIZATION PROFILE VIEW
   ========================================================================== */
export function OrganizationProfilePage({ navigate }) {
  return (
    <>
      <PageHeading
        eyebrow="ORGANIZATION / PROFILE"
        title="Organization Profile"
        description="Institutional identity, academic structure, and tenant configuration."
      />
      <section className="phase-panel phase-overview-panel">
        <div className="phase-panel-heading">
          <div>
            <span className="phase-eyebrow">TENANT METADATA</span>
            <h2>{DEMO_ORGANIZATION.name}</h2>
          </div>
          <span className="phase-status">
            <i />
            {DEMO_ORGANIZATION.status}
          </span>
        </div>
        <div className="phase-org-facts">
          <div>
            <span>Institution City</span>
            <strong>{DEMO_ORGANIZATION.city}</strong>
          </div>
          <div>
            <span>Enrolled People</span>
            <strong>{DEMO_ORGANIZATION.peopleCount} members</strong>
          </div>
          <div>
            <span>Defined Roles</span>
            <strong>{DEMO_ORGANIZATION.roleCount} active</strong>
          </div>
          <div>
            <span>Academic Cohorts</span>
            <strong>{DEMO_ORGANIZATION.batchCount} batches</strong>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="button" className="phase-primary-button" onClick={() => navigate('/roles')}>
            Manage Roles →
          </button>
          <button type="button" className="phase-text-button" onClick={() => navigate('/people')}>
            View Directory →
          </button>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   PEOPLE DIRECTORY
   ========================================================================== */
export function PeoplePage({ auth }) {
  const people = useMemo(
    () =>
      PEOPLE.filter(
        (person) =>
          auth.profile.is_platform_admin ||
          auth.profile.scopes.length === 0 ||
          auth.profile.scopes.some(
            (scope) =>
              (scope.type === 'batch' && scope.id === person.batchId) ||
              (scope.type === 'department' && scope.id === person.departmentId)
          )
      ),
    [auth.profile]
  )
  const scoped = auth.profile.scopes.length > 0 && !isPlatformAdmin(auth.profile)

  return (
    <>
      <PageHeading
        eyebrow="ORGANIZATION / PEOPLE"
        title="People"
        description="Member directory scoped by your active permissions and cohort bindings."
        action={
          <button className="phase-primary-button" type="button" disabled={!hasRight(auth.profile.rights, 'users.create')}>
            + Add person
          </button>
        }
      />
      {scoped && (
        <div className="phase-scope-notice">
          <span className="phase-scope-dot" /> {scopeDescription(auth.profile.scopes)}
        </div>
      )}
      <section className="phase-panel phase-table-panel">
        <div className="phase-panel-heading">
          <div>
            <span className="phase-eyebrow">DIRECTORY</span>
            <h2>{people.length} people visible</h2>
          </div>
          <span className="phase-table-caption">{scoped ? 'Scoped results' : 'Organization-wide'}</span>
        </div>
        {people.length === 0 ? (
          <EmptyState title="No people in this scope" description="There are no members assigned to your cohort." />
        ) : (
          <div className="phase-table-wrap">
            <table className="phase-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Organization role</th>
                  <th>Department</th>
                  <th>Batch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <strong>{person.name}</strong>
                      <small>{person.email}</small>
                    </td>
                    <td>{person.role}</td>
                    <td>{person.department}</td>
                    <td>{person.batch}</td>
                    <td>
                      <span className="phase-row-status">{person.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

/* ==========================================================================
   DESIGN B — ROLE & RIGHTS BUILDER
   ========================================================================== */
export function RolesPage({ roles, navigate, onCreateRole, auth }) {
  return (
    <>
      <PageHeading
        eyebrow="ORGANIZATION / ACCESS"
        title="Roles"
        description="Dynamic organization roles bounded by the institutional ceiling."
        action={
          <button
            className="phase-primary-button"
            type="button"
            disabled={!hasRight(auth.profile.rights, 'roles.create')}
            onClick={onCreateRole}
          >
            + Create Role
          </button>
        }
      />

      <div className="phase-role-grid">
        {roles.map((role, index) => (
          <motion.article
            key={role.id}
            className="phase-role-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -4 }}
          >
            <div className={`phase-role-symbol phase-role-symbol-${index % 4}`}>
              {role.name.slice(0, 1)}
            </div>
            <div className="phase-role-card-title">
              <h2>{role.name}</h2>
              <span>{role.scopeLabel}</span>
            </div>
            <p>{role.rights.length} rights</p>
            <div className="phase-role-card-footer">
              <span>{role.rights.slice(0, 2).join(' · ') || 'No assigned rights'}</span>
              <button
                type="button"
                onClick={() => navigate(`/roles/${role.id}`)}
                disabled={!hasRight(auth.profile.rights, 'roles.view')}
              >
                [View] <b aria-hidden="true">→</b>
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  )
}

export function RoleEditorPage({ role, availableRights, onRightsChange, auth, navigate }) {
  const [roleName, setRoleName] = useState(role?.name ?? 'Role')

  if (!role) {
    return <EmptyState title="Role not found" description="Select a role from the organization roles list." />
  }

  function toggleRight(right) {
    if (!availableRights.includes(right)) return
    const has = role.rights.includes(right)
    onRightsChange(role.id, has ? role.rights.filter((item) => item !== right) : [...role.rights, right])
  }

  return (
    <>
      <header className="phase-page-heading">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (navigate ? navigate('/roles') : window.history.back())}
            className="phase-text-button font-bold text-xs"
          >
            ← Roles
          </button>
          <div>
            <span className="phase-eyebrow">ORGANIZATION / ROLES</span>
            <h1 className="mt-0">{roleName}</h1>
          </div>
        </div>
        <div className="phase-role-header-actions">
          <button
            type="button"
            className="phase-primary-button"
            onClick={() => (navigate ? navigate('/roles') : window.history.back())}
            disabled={!hasRight(auth.profile.rights, 'roles.rights.edit')}
          >
            Save
          </button>
        </div>
      </header>

      <section className="phase-rights-editor">
        {/* Role Name Field */}
        <div className="phase-role-name-field">
          <label htmlFor="role-name-input">Role Name</label>
          <input
            id="role-name-input"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            disabled={!hasRight(auth.profile.rights, 'roles.rights.edit')}
          />
        </div>

        {/* Rights Section */}
        <div className="p-5 border-b border-border">
          <strong className="block text-xs font-bold text-error uppercase tracking-wider">
            Rights available to this role
          </strong>
        </div>

        <div className="phase-rights-groups">
          {RIGHT_GROUPS.map(([label, prefix]) => (
            <section className="phase-right-group" key={label}>
              <h3>{label}</h3>
              {RIGHT_CODES.filter((right) => right.startsWith(prefix)).map((right) => {
                const isAvailable = availableRights.includes(right)
                const isChecked = role.rights.includes(right)
                return (
                  <label
                    className={`phase-right-option ${!isAvailable ? 'unavailable' : ''}`}
                    key={right}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={!isAvailable || !hasRight(auth.profile.rights, 'roles.rights.edit')}
                      onChange={() => toggleRight(right)}
                    />
                    <span className="phase-checkmark" aria-hidden="true" />
                    <span>
                      <strong>{RIGHT_LABELS[right]}</strong>
                      <code>{right}</code>
                    </span>
                    {!isAvailable && <small>Outside ceiling</small>}
                  </label>
                )
              })}
            </section>
          ))}
        </div>

        {/* Ceiling Callout Model */}
        <div className="phase-ceiling-callout">
          <strong>Organization ceiling: {availableRights.length} rights</strong>
          <p>This role can only receive rights available to the organization. Rights outside the ceiling cannot be assigned.</p>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   DEPARTMENTS & BATCHES
   ========================================================================== */
export function DepartmentsPage() {
  return (
    <>
      <PageHeading
        eyebrow="ORGANIZATION / STRUCTURE"
        title="Departments"
        description="Departmental hierarchy and staff assignments."
        action={<button className="phase-primary-button" type="button">+ Add department</button>}
      />
      <section className="phase-department-grid">
        {DEPARTMENTS.map((department) => (
          <article className="phase-panel phase-department-card" key={department.id}>
            <span className="phase-department-mark">{department.name.slice(0, 1)}</span>
            <h2>{department.name}</h2>
            <p>
              Department head: <strong>{department.head}</strong>
            </p>
            <div>
              <span>{department.people} people</span>
              <button type="button" aria-label={`Open ${department.name}`}>
                →
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

export function BatchesPage({ auth }) {
  const batches = BATCHES.filter((batch) =>
    canAccessScope(auth.profile, [
      { type: 'batch', id: batch.id },
      { type: 'department', id: batch.departmentId },
    ])
  )
  const scoped = auth.profile.scopes.length > 0 && !isPlatformAdmin(auth.profile)

  return (
    <>
      <PageHeading
        eyebrow="ORGANIZATION / STRUCTURE"
        title="Batches"
        description="Cohorts, instructors, and enrolled learners."
        action={
          <button className="phase-primary-button" type="button" disabled={!hasRight(auth.profile.rights, 'batches.create')}>
            + Create batch
          </button>
        }
      />
      {scoped && (
        <div className="phase-scope-notice">
          <span className="phase-scope-dot" /> {scopeDescription(auth.profile.scopes)}
        </div>
      )}
      {batches.length === 0 ? (
        <EmptyState title="No batches in this scope" description="No cohort records match your assigned scope." />
      ) : (
        <section className="phase-batch-grid">
          {batches.map((batch) => (
            <article key={batch.id} className="phase-panel phase-batch-card">
              <div className="phase-panel-heading">
                <div>
                  <span className="phase-eyebrow">{batch.department}</span>
                  <h2>{batch.name}</h2>
                </div>
                <span className="phase-status">
                  <i />
                  {batch.status}
                </span>
              </div>
              <div className="phase-batch-facts">
                <span>
                  <small>Teacher</small>
                  <strong>{batch.teacher}</strong>
                </span>
                <span>
                  <small>People</small>
                  <strong>{batch.people}</strong>
                </span>
                <span>
                  <small>Scope</small>
                  <strong>{scoped ? 'Assigned' : 'Org-wide'}</strong>
                </span>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  )
}

export function AuditPage() {
  return (
    <>
      <PageHeading
        eyebrow="ORGANIZATION / SECURITY"
        title="Audit Trail"
        description="Reviewable audit log of organization access and credential changes."
      />
      <section className="phase-panel phase-audit-list">
        {RECENT_ACTIVITY.map((item, index) => (
          <article key={item.action}>
            <span className="phase-audit-index">0{index + 1}</span>
            <div>
              <strong>{item.action}</strong>
              <p>{item.detail}</p>
            </div>
            <time>{item.time}</time>
          </article>
        ))}
      </section>
    </>
  )
}

/* ==========================================================================
   DESIGN C — SUPERADMIN ORGANIZATION CONTROL
   ========================================================================== */
export function OrganizationsPage({ organizations, onCreateOrganization, onSetOrganizationStatus, navigate }) {
  const ceilingBars = [
    { label: 'Users', enabled: 5, total: 5, pct: 100 },
    { label: 'Roles', enabled: 6, total: 6, pct: 100 },
    { label: 'Departments', enabled: 3, total: 3, pct: 100 },
    { label: 'Batches', enabled: 3, total: 3, pct: 100 },
    { label: 'Organization', enabled: 2, total: 2, pct: 100 },
    { label: 'Audit', enabled: 1, total: 1, pct: 100 },
  ]

  return (
    <>
      <PageHeading
        eyebrow="PLATFORM ADMINISTRATION"
        title="Organizations"
        description="Manage tenant organizations, provision ceilings, and configure platform access."
        action={
          <button className="phase-primary-button" type="button" onClick={onCreateOrganization}>
            + Create Org
          </button>
        }
      />

      {/* Primary Showcase Card for Delhi Public Academy (Design C Mockup) */}
      <section className="phase-superadmin-org-card mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-error">Delhi Public Academy</h2>
              <span className="phase-status">
                <i /> ACTIVE
              </span>
            </div>
            <p className="mt-1 text-xs text-error/80">
              248 users • 8 roles • 20 rights
            </p>
          </div>
        </div>

        {/* Organization Ceiling Progress Section */}
        <div className="phase-org-ceiling-section">
          <h3>Organization ceiling</h3>
          <div className="phase-ceiling-bars">
            {ceilingBars.map((bar) => (
              <div key={bar.label} className="phase-ceiling-bar-item">
                <div className="phase-ceiling-bar-labels">
                  <span>{bar.label}</span>
                  <span>{bar.enabled} / {bar.total} ({bar.pct}%)</span>
                </div>
                <div className="phase-ceiling-bar-track">
                  <div className="phase-ceiling-bar-fill" style={{ width: `${bar.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="phase-superadmin-card-footer">
          <button
            type="button"
            className="phase-primary-button"
            onClick={() => navigate('/platform/organizations/org_001/rights')}
          >
            Manage Ceiling →
          </button>
        </div>
      </section>

      {/* Organizations Table */}
      <section className="phase-panel phase-org-list">
        <div className="phase-panel-heading">
          <div>
            <span className="phase-eyebrow">TENANTS</span>
            <h2>{organizations.length} organizations</h2>
          </div>
          <span className="phase-table-caption">Platform tenants</span>
        </div>

        <div className="phase-table-wrap">
          <table className="phase-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>People</th>
                <th>Roles</th>
                <th>Rights</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td>
                    <strong>{org.name}</strong>
                    <small>{org.city}</small>
                  </td>
                  <td>{org.peopleCount}</td>
                  <td>{org.roleCount}</td>
                  <td>{org.rightsCount}</td>
                  <td>
                    <span className={`phase-row-status ${org.status === 'Active' ? '' : 'inactive'}`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="phase-table-actions">
                    <button type="button" onClick={() => navigate(`/platform/organizations/${org.id}/rights`)}>
                      Manage Ceiling
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetOrganizationStatus(org.id, org.status === 'Active' ? 'Suspended' : 'Active')}
                    >
                      {org.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export function OrganizationCeilingPage({ ceiling, onToggleRight, navigate }) {
  return (
    <>
      <header className="phase-page-heading">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (navigate ? navigate('/platform/organizations') : window.history.back())}
            className="phase-text-button font-bold text-xs"
          >
            ← Organizations
          </button>
          <div>
            <span className="phase-eyebrow">ORGANIZATION RIGHTS</span>
            <h1 className="mt-0">{DEMO_ORGANIZATION.name} Ceiling</h1>
          </div>
        </div>
        <span className="phase-count-badge">{ceiling.length} rights enabled</span>
      </header>

      <section className="phase-rights-editor">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-error">Organization Rights</h2>
            <p className="text-xs text-error/80 mt-0.5">Platform SuperAdmin directly manages the maximum rights ceiling for this tenant.</p>
          </div>
          <button
            type="button"
            className="phase-primary-button"
            onClick={() => (navigate ? navigate('/platform/organizations') : window.history.back())}
          >
            Save Ceiling
          </button>
        </div>

        <div className="phase-rights-groups">
          {RIGHT_GROUPS.map(([label, prefix]) => (
            <section className="phase-right-group" key={label}>
              <h3>{label}</h3>
              {RIGHT_CODES.filter((right) => right.startsWith(prefix)).map((right) => (
                <label className="phase-right-option" key={right}>
                  <input
                    type="checkbox"
                    checked={ceiling.includes(right)}
                    onChange={() => onToggleRight(right)}
                  />
                  <span className="phase-checkmark" aria-hidden="true" />
                  <span>
                    <strong>{RIGHT_LABELS[right]}</strong>
                    <code>{right}</code>
                  </span>
                </label>
              ))}
            </section>
          ))}
        </div>
      </section>
    </>
  )
}

export function RightsCatalogPage() {
  return (
    <>
      <PageHeading
        eyebrow="PLATFORM / ACCESS"
        title="Rights Catalog"
        description="Catalog of access rights supported by Heftin Academy."
      />
      <section className="phase-catalog-grid">
        {RIGHT_GROUPS.map(([label, prefix]) => (
          <article className="phase-panel phase-catalog-group" key={label}>
            <span className="phase-eyebrow">RIGHTS</span>
            <h2>{label}</h2>
            {RIGHT_CODES.filter((right) => right.startsWith(prefix)).map((right) => (
              <div key={right}>
                <code>{right}</code>
                <span>Platform Catalog</span>
              </div>
            ))}
          </article>
        ))}
      </section>
    </>
  )
}

/* ==========================================================================
   # 15. HOW I'D PRESENT THE 3 DESIGNS: /design-samples
   ========================================================================== */
export function DesignSamplesPage({ navigate }) {
  const samples = [
    {
      num: '01',
      title: 'Organization Dashboard',
      subtitle: 'Design A',
      detail: 'Rights-based navigation, scoped resource cards, organization profile, and audit trail.',
      path: '/dashboard',
    },
    {
      num: '02',
      title: 'Role & Rights Builder',
      subtitle: 'Design B',
      detail: 'Dynamic organization roles, visual permission matrix, and organization ceiling protection.',
      path: '/roles/teacher',
    },
    {
      num: '03',
      title: 'SuperAdmin Organization Ceiling',
      subtitle: 'Design C',
      detail: 'Platform tenant management, organization ceiling progress bars, and platform admin concept.',
      path: '/platform/organizations',
    },
  ]

  return (
    <>
      <PageHeading
        eyebrow="ARCHITECTURE"
        title="Architecture Blueprints"
        description="The 3 Phase 1 access-control designs."
      />

      <section className="phase-sample-grid-3">
        {samples.map((sample, index) => (
          <motion.article
            className="phase-panel phase-sample-card"
            key={sample.path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <span className="phase-sample-index">Design {sample.num}</span>
            <h2 className="mt-2 text-lg font-bold text-error">{sample.title}</h2>
            <p className="mt-2 text-xs text-error/80 leading-relaxed">{sample.detail}</p>
            <div className="mt-auto pt-4">
              <button
                className="phase-primary-button w-full"
                type="button"
                onClick={() => navigate(sample.path)}
              >
                Explore Design →
              </button>
            </div>
          </motion.article>
        ))}
      </section>
    </>
  )
}

/* ==========================================================================
   # 16. AUTH SAMPLES HUB VIEW: /auth-samples
   ========================================================================== */
export function AuthSamplesHubView({ navigate }) {
  const [activeTab, setActiveTab] = useState('1')
  const [samplePersona, setSamplePersona] = useState('org_admin')
  const [subdomain, setSubdomain] = useState('dpa')
  const [cohort, setCohort] = useState('101')
  const [wfKey, setWfKey] = useState('invite')
  const [wfStep, setWfStep] = useState(0)

  const workflows = {
    invite: {
      title: 'Workflow 01: Institutional Invite & Activation',
      steps: [
        {
          num: '01',
          name: 'Token Ingestion',
          heading: 'Step 1: Cryptographic Invite Token Resolution',
          actor: 'Client → Edge Gateway',
          guarantee: 'Zero Client Tenant ID Leakage',
          desc: 'Faculty member opens invite link with one-time signed token (inv_sec_892f). Edge gateway verifies HMAC-SHA256 signature and resolves tenant without client database IDs.',
          status: 'HTTP 200 OK',
          payload: { invite_valid: true, tenant_id: 'org_001', tenant_slug: 'dpa', designated_role: 'faculty', assigned_scope: { type: 'batch', id: 'batch_101' } },
        },
        {
          num: '02',
          name: 'Capacity Audit',
          heading: 'Step 2: Institutional License Ceiling Verification',
          actor: 'Gateway → Central Service',
          guarantee: 'Fail-Closed Tenant Ceiling Guardrail',
          desc: 'Central platform verifies that activating this faculty member will not breach the purchased active seat allocation (42/50 seats occupied).',
          status: 'HTTP 200 OK',
          payload: { tenant_id: 'org_001', seat_limit: 50, current_active_seats: 42, ceiling_breach: false, allow_activation: true },
        },
        {
          num: '03',
          name: 'Credential Proof',
          heading: 'Step 3: Argon2id Hashing & WebAuthn Enrollment',
          actor: 'Client → Auth Authority',
          guarantee: 'Hardware Attested Authentication Proof',
          desc: 'User sets credentials hashed via Argon2id (memory 64MB, p=4) and registers FIDO2 WebAuthn passkey.',
          status: 'HTTP 201 Created',
          payload: { user_id: 'usr_teacher_04', status: 'active', credential_enrolled: true },
        },
        {
          num: '04',
          name: 'Token Issuance',
          heading: 'Step 4: Scoped Session Token Issuance',
          actor: 'Central Auth Server → Client',
          guarantee: 'Server-Authoritative Scoped Token',
          desc: 'Gateway signs and issues an RS256 token scoped strictly to batch_101 with pre-computed rights.',
          status: 'HTTP 200 OK',
          payload: { sub: 'usr_teacher_04', tenant_id: 'org_001', role: 'faculty', scopes: [{ type: 'batch', id: 'batch_101' }], rights: ['batches.view', 'exams.grade'] },
        },
      ],
    },
    stepup: {
      title: 'Workflow 02: High-Privilege Step-Up MFA Challenge',
      steps: [
        {
          num: '01',
          name: 'Standard Baseline',
          heading: 'Step 1: Baseline Session Operational Boundary',
          actor: 'Faculty Client → Edge Gateway',
          guarantee: 'Principle of Least Privilege',
          desc: 'Faculty member operates under standard single-factor authentication claims for routine grading tasks.',
          status: 'HTTP 200 OK',
          payload: { batch_id: 'batch_101', active_learners: 42, elevated: false },
        },
        {
          num: '02',
          name: 'High-Risk Trigger',
          heading: 'Step 2: Sensitive Operation Initiation',
          actor: 'Faculty Client → Gateway Boundary',
          guarantee: 'High-Risk Operation Interception',
          desc: 'Faculty member initiates high-risk operation: publishing state exam keys or exporting unmasked student PII.',
          status: 'Policy Intercepted',
          payload: { action: 'publish_official_key', policy_requirement: 'acr_values: urn:heftin:mfa-strong' },
        },
        {
          num: '03',
          name: 'HTTP 401 Challenge',
          heading: 'Step 3: Zero-Trust Gateway Step-Up Challenge',
          actor: 'API Gateway → Faculty Client',
          guarantee: 'Fail-Closed Authentication Step-Up',
          desc: 'Gateway intercepts request, issuing HTTP 401 with WWW-Authenticate header requiring strong MFA verification.',
          status: 'HTTP 401 Unauthorized',
          payload: { error: 'step_up_mfa_required', challenge_id: 'mfa_chal_902bf8', allowed_methods: ['webauthn_fido2', 'totp'] },
        },
        {
          num: '04',
          name: 'Ephemeral Grant',
          heading: 'Step 4: Ephemeral 15-Minute Elevated Scope Grant',
          actor: 'Auth Authority → Client',
          guarantee: 'Time-Bounded Ephemeral Privilege (15-Min TTL)',
          desc: 'User inputs 6-digit TOTP code. Gateway grants 15-minute elevated token claim, then publishes keys.',
          status: 'HTTP 200 OK (Elevated)',
          payload: { elevation_granted: true, acr: 'urn:heftin:mfa:strong', elevated_until: '+15m', audit_log_id: 'aud_9981' },
        },
      ],
    },
    sso: {
      title: 'Workflow 03: Enterprise SAML 2.0 / OIDC SSO Federation',
      steps: [
        {
          num: '01',
          name: 'Domain Discovery',
          heading: 'Step 1: Institutional Email & IdP Discovery',
          actor: 'User → Discovery Endpoint',
          guarantee: 'Zero Client Tenant ID Leak',
          desc: 'User enters institutional email (dean@apex.edu). Gateway resolves tenant identity provider configuration via domain hash.',
          status: 'HTTP 200 OK',
          payload: { sso_enabled: true, tenant_id: 'org_002', idp_name: 'Apex University Entra ID' },
        },
        {
          num: '02',
          name: 'SAML Redirect',
          heading: 'Step 2: Cryptographically Signed SAML AuthnRequest',
          actor: 'Gateway → University IdP',
          guarantee: 'Cryptographic Assertion Nonce Protection',
          desc: 'Gateway signs SAML 2.0 AuthnRequest with Heftin Academy private key and redirects browser to university portal.',
          status: 'HTTP 302 Redirect',
          payload: { sp_entity_id: 'https://auth.heftin.edu/sp', binding: 'HTTP-Redirect', signature_valid: true },
        },
        {
          num: '03',
          name: 'Assertion Verify',
          heading: 'Step 3: SAML Response Assertion Ingestion & Signature Verification',
          actor: 'University IdP → Heftin ACS Endpoint',
          guarantee: 'X.509 Signature & Time-Window Validation',
          desc: 'IdP posts signed SAML Response. Gateway validates X.509 signature and extracts verified enterprise groups.',
          status: 'HTTP 200 OK',
          payload: { name_id: 'dean@apex.edu', groups: ['Faculty-AcademicCouncil', 'Dean-Engineering'], signature_valid: true },
        },
        {
          num: '04',
          name: 'JIT Mapping',
          heading: 'Step 4: Server-Side JIT Mapping & Ceiling-Bound Token Issuance',
          actor: 'Auth Authority → Client',
          guarantee: 'Anti-Self-Escalation Ceiling Enforcement',
          desc: 'Server maps enterprise group Dean-Engineering to internal org_admin role, bounding rights strictly to 70/70 ceiling.',
          status: 'HTTP 200 OK',
          payload: { sub: 'usr_dean_ananya', tenant_id: 'org_002', role: 'org_admin', rights_count: '70/70', auth_method: 'federated_saml2' },
        },
      ],
    },
  }

  const personas = {
    org_admin: {
      email: 'orgadmin@dpa.edu',
      rights: 'Full organization administration across users, roles, departments, and batches.',
    },
    teacher: {
      email: 'teacher@dpa.edu',
      rights: 'View assigned batch exams, grade student submissions, review question analytics.',
    },
    student: {
      email: 'sana@dpa.edu',
      rights: 'Attempt mock tests, view detailed answer keys, track performance percentiles.',
    },
    platform_admin: {
      email: 'admin@heftin.com',
      rights: 'Platform SuperAdmin: provision tenant academies, manage global rights ceiling.',
    },
  }

  return (
    <>
      <PageHeading
        title="Auth Architecture Samples"
      />

      <div className="phase-sample-hub" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <section className="phase-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--error)' }}>Security Governance</h2>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', background: 'rgba(0,130,142,0.1)', padding: '3px 8px', borderRadius: '6px' }}>100% Architecture Compliant</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>✓ Server-Computed Rights</span>
              <strong style={{ fontSize: '13px', color: 'var(--error)', display: 'block', margin: '2px 0 4px' }}>Zero Client Arithmetic</strong>
              <p style={{ fontSize: '11px', color: 'var(--error)', margin: 0, opacity: 0.85 }}>Permissions derive directly from session tokens; client never computes role grants.</p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>✓ Scope Isolation</span>
              <strong style={{ fontSize: '13px', color: 'var(--error)', display: 'block', margin: '2px 0 4px' }}>Assigned Batch Scopes</strong>
              <p style={{ fontSize: '11px', color: 'var(--error)', margin: 0, opacity: 0.85 }}>Teachers access only their assigned cohorts (e.g. batch_101) with fail-closed bounds.</p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>✓ SuperAdmin Boundary</span>
              <strong style={{ fontSize: '13px', color: 'var(--error)', display: 'block', margin: '2px 0 4px' }}>account_id: null</strong>
              <p style={{ fontSize: '11px', color: 'var(--error)', margin: 0, opacity: 0.85 }}>SuperAdmin is isolated at the central platform layer, unbound by tenant ceilings.</p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>✓ Ceiling Safeguards</span>
              <strong style={{ fontSize: '13px', color: 'var(--error)', display: 'block', margin: '2px 0 4px' }}>Anti-Self-Escalation</strong>
              <p style={{ fontSize: '11px', color: 'var(--error)', margin: 0, opacity: 0.85 }}>Organization admins cannot grant rights that exceed their purchased institutional ceiling.</p>
            </div>
          </div>
        </section>

        <section className="phase-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" onClick={() => setActiveTab('1')} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, border: activeTab === '1' ? '1px solid var(--primary)' : '1px solid var(--border)', background: activeTab === '1' ? 'var(--primary)' : '#fff', color: activeTab === '1' ? '#fff' : 'var(--error)', cursor: 'pointer' }}>1. Executive Split-Screen</button>
              <button type="button" onClick={() => setActiveTab('2')} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, border: activeTab === '2' ? '1px solid var(--primary)' : '1px solid var(--border)', background: activeTab === '2' ? 'var(--primary)' : '#fff', color: activeTab === '2' ? '#fff' : 'var(--error)', cursor: 'pointer' }}>2. Subdomain Gateway</button>
              <button type="button" onClick={() => setActiveTab('3')} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, border: activeTab === '3' ? '1px solid var(--primary)' : '1px solid var(--border)', background: activeTab === '3' ? 'var(--primary)' : '#fff', color: activeTab === '3' ? '#fff' : 'var(--error)', cursor: 'pointer' }}>3. Cohort Chooser</button>
            </div>
          </div>

          {activeTab === '1' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px' }}>Executive Split-Screen</h3>
                <div style={{ padding: '12px', background: 'var(--bg-soft)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>Computed Rights:</span>
                  <span style={{ fontSize: '11.5px', fontWeight: 600 }}>{personas[samplePersona].rights}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Category 1: Organisation */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: ['org_admin', 'teacher', 'platform_admin'].includes(samplePersona) ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: ['org_admin', 'teacher', 'platform_admin'].includes(samplePersona) ? '#fff' : 'var(--bg-soft)',
                    boxShadow: ['org_admin', 'teacher', 'platform_admin'].includes(samplePersona) ? '0 1px 4px rgba(0,130,142,0.08)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em' }}>Organisation</span>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--primary)', background: 'rgba(0,130,142,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Institutional Scope</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { key: 'org_admin', label: 'Org Admin' },
                      { key: 'teacher', label: 'Faculty' },
                      { key: 'platform_admin', label: 'SuperAdmin' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSamplePersona(key)}
                        style={{
                          flex: 1,
                          padding: '7px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: samplePersona === key ? '1px solid var(--primary)' : '1px solid var(--border)',
                          background: samplePersona === key ? 'var(--primary)' : '#fff',
                          color: samplePersona === key ? '#fff' : 'var(--error)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category 2: Individual */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: samplePersona === 'student' ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: samplePersona === 'student' ? '#fff' : 'var(--bg-soft)',
                    boxShadow: samplePersona === 'student' ? '0 1px 4px rgba(0,130,142,0.08)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--error)', letterSpacing: '0.04em' }}>Individual</span>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--error)', opacity: 0.7, padding: '2px 6px', borderRadius: '4px' }}>Learner Portal</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setSamplePersona('student')}
                      style={{
                        flex: 1,
                        padding: '7px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: samplePersona === 'student' ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: samplePersona === 'student' ? 'var(--primary)' : '#fff',
                        color: samplePersona === 'student' ? '#fff' : 'var(--error)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Student
                    </button>
                  </div>
                </div>

                <input type="text" readOnly value={personas[samplePersona].email} style={{ padding: '8px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                <button type="button" className="phase-primary-button" onClick={() => navigate(samplePersona === 'platform_admin' ? '/platform/organizations' : '/dashboard')}>Launch Selected Session →</button>
              </div>
            </div>
          )}

          {activeTab === '2' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px' }}>Subdomain Tenant Gateway</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
                <input type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} style={{ padding: '8px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>.heftin.edu</span>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>✓ Verified: org_001</span>
              </div>
              <button type="button" className="phase-primary-button" onClick={() => navigate('/dashboard')}>Open Tenant Workspace →</button>
            </div>
          )}

          {activeTab === '3' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px' }}>Cohort Scope Chooser</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                {['101', '102', 'dept'].map((c) => (
                  <button key={c} type="button" onClick={() => setCohort(c)} style={{ flex: 1, padding: '12px', textAlign: 'left', borderRadius: '10px', border: cohort === c ? '1px solid var(--primary)' : '1px solid var(--border)', background: cohort === c ? '#f8fcfe' : '#fff', cursor: 'pointer' }}>
                    <strong style={{ fontSize: '12px', color: cohort === c ? 'var(--primary)' : 'var(--error)', display: 'block' }}>{c === '101' ? 'Batch 101' : c === '102' ? 'Batch 102' : 'Department Observer'}</strong>
                    <span style={{ fontSize: '10.5px', opacity: 0.8 }}>{c === '101' ? '42 Students · Active' : c === '102' ? '38 Students' : 'Audit across batches'}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="phase-primary-button" onClick={() => navigate('/dashboard')}>Launch Cohort Scope →</button>
            </div>
          )}
        </section>

        <section className="phase-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--error)' }}>Auth Workflows</h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" onClick={() => { setWfKey('invite'); setWfStep(0); }} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, border: wfKey === 'invite' ? '1px solid var(--primary)' : '1px solid var(--border)', background: wfKey === 'invite' ? 'var(--primary)' : '#fff', color: wfKey === 'invite' ? '#fff' : 'var(--error)', cursor: 'pointer' }}>1. Invite &amp; Activation</button>
              <button type="button" onClick={() => { setWfKey('stepup'); setWfStep(0); }} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, border: wfKey === 'stepup' ? '1px solid var(--primary)' : '1px solid var(--border)', background: wfKey === 'stepup' ? 'var(--primary)' : '#fff', color: wfKey === 'stepup' ? '#fff' : 'var(--error)', cursor: 'pointer' }}>2. Step-Up MFA</button>
              <button type="button" onClick={() => { setWfKey('sso'); setWfStep(0); }} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, border: wfKey === 'sso' ? '1px solid var(--primary)' : '1px solid var(--border)', background: wfKey === 'sso' ? 'var(--primary)' : '#fff', color: wfKey === 'sso' ? '#fff' : 'var(--error)', cursor: 'pointer' }}>3. SAML 2.0 / SSO</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
            {workflows[wfKey].steps.map((st, idx) => (
              <button
                key={st.num}
                type="button"
                onClick={() => setWfStep(idx)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: wfStep === idx ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: wfStep === idx ? '#f0f9fa' : idx < wfStep ? '#fff' : 'var(--bg-soft)',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', display: 'block', fontFamily: 'monospace' }}>STEP {st.num}</span>
                <strong style={{ fontSize: '11.5px', color: 'var(--error)', display: 'block' }}>{st.name}</strong>
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
            <div style={{ padding: '16px', background: 'var(--bg-soft)', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary)', background: '#e0f2f3', padding: '3px 8px', borderRadius: '99px' }}>✓ {workflows[wfKey].steps[wfStep].guarantee}</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '6px 0', color: 'var(--error)' }}>{workflows[wfKey].steps[wfStep].heading}</h4>
                <p style={{ fontSize: '11.5px', color: 'var(--error)', opacity: 0.85, margin: '0 0 12px', lineHeight: 1.5 }}>{workflows[wfKey].steps[wfStep].desc}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <button type="button" disabled={wfStep === 0} onClick={() => setWfStep((s) => Math.max(0, s - 1))} style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', cursor: wfStep === 0 ? 'not-allowed' : 'pointer', opacity: wfStep === 0 ? 0.5 : 1 }}>← Previous</button>
                <span style={{ fontSize: '10.5px', fontWeight: 700, fontFamily: 'monospace' }}>STEP {wfStep + 1} OF 4</span>
                <button type="button" onClick={() => setWfStep((s) => (s < 3 ? s + 1 : 0))} style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '6px', border: '1px solid var(--primary)', background: 'var(--primary)', color: '#fff', cursor: 'pointer' }}>{wfStep === 3 ? 'Restart Flow ✓' : 'Next Step →'}</button>
              </div>
            </div>

            <div style={{ padding: '14px', background: '#001a1c', borderRadius: '10px', border: '1px solid #00363a', color: '#cce6e8', fontFamily: 'monospace', fontSize: '10.5px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #00363a', paddingBottom: '6px', color: '#80c4cb' }}>
                <span>Protocol Exchange</span>
                <span style={{ color: '#6ee7b7', fontWeight: 700 }}>{workflows[wfKey].steps[wfStep].status}</span>
              </div>
              <pre style={{ margin: 0, color: '#a5f3fc', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(workflows[wfKey].steps[wfStep].payload, null, 2)}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

/* ==========================================================================
   # 17. SESSION LIFECYCLE & ASYNC STATES VIEW: /session-lifecycle
   ========================================================================== */
export function SessionLifecycleView({ navigate }) {
  const [state, setState] = useState('loading')

  return (
    <>
      <PageHeading
        eyebrow="TICKET HAC01-FE-11"
        title="Session Lifecycle & Async States"
        description="Interactive testbench for Loading, 401 Session Expiry, 403 Forbidden, and 500 Retry states."
      />

      <section className="phase-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          {['loading', 'empty', '401', '403', '500'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setState(s)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: state === s ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: state === s ? 'var(--primary)' : '#fff',
                color: state === s ? '#fff' : 'var(--error)',
                cursor: 'pointer',
              }}
            >
              {s === 'loading' ? '1. Loading State' : s === 'empty' ? '2. Empty State' : s === '401' ? '3. 401 Session Expiry' : s === '403' ? '4. 403 Forbidden Gate' : '5. 500 Server Error'}
            </button>
          ))}
        </div>

        <div style={{ minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', background: 'var(--bg-soft)', borderRadius: '12px' }}>
          {state === 'loading' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
              <strong style={{ fontSize: '14px', display: 'block' }}>Loading workspace data...</strong>
              <span style={{ fontSize: '11.5px', opacity: 0.8 }}>Synchronizing assigned permissions and batch enrollments.</span>
            </div>
          )}

          {state === 'empty' && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', background: '#e0f2f3', padding: '4px 10px', borderRadius: '99px', display: 'inline-block', marginBottom: '8px' }}>EMPTY STATE</span>
              <strong style={{ fontSize: '14px', display: 'block' }}>No records found</strong>
              <p style={{ fontSize: '11.5px', opacity: 0.8, margin: '4px 0 14px' }}>There are no items created in this section yet.</p>
              <button type="button" className="phase-primary-button" onClick={() => navigate('/dashboard')}>Create First Item</button>
            </div>
          )}

          {state === '401' && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#991b1b', background: '#fee2e2', padding: '4px 10px', borderRadius: '99px', display: 'inline-block', marginBottom: '8px' }}>HTTP 401</span>
              <strong style={{ fontSize: '14px', display: 'block' }}>Session Expired (401)</strong>
              <p style={{ fontSize: '11.5px', opacity: 0.8, margin: '4px 0 14px' }}>Your authentication token has expired. Redirecting to login...</p>
              <a href="/login.html" className="phase-primary-button" style={{ textDecoration: 'none' }}>Re-authenticate Now →</a>
            </div>
          )}

          {state === '403' && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#991b1b', background: '#fee2e2', padding: '4px 10px', borderRadius: '99px', display: 'inline-block', marginBottom: '8px' }}>HTTP 403</span>
              <strong style={{ fontSize: '14px', display: 'block' }}>403 Access Denied</strong>
              <p style={{ fontSize: '11.5px', opacity: 0.8, margin: '4px 0 8px' }}>Your assigned role lacks required permission:</p>
              <code style={{ background: '#fff', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--primary)', display: 'inline-block', marginBottom: '14px' }}>roles.rights.edit</code>
              <div><button type="button" className="phase-primary-button" onClick={() => navigate('/dashboard')}>Return to Authorized Home</button></div>
            </div>
          )}

          {state === '500' && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>⚠️</span>
              <strong style={{ fontSize: '14px', display: 'block' }}>Endpoint Error (500)</strong>
              <p style={{ fontSize: '11.5px', opacity: 0.8, margin: '4px 0 14px' }}>API communication timed out while fetching performance metrics.</p>
              <button type="button" className="phase-primary-button" onClick={() => setState('loading')}>Retry Connection</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}