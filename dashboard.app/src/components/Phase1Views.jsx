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