/**
 * @typedef {"users.view" | "users.create" | "users.edit" | "users.deactivate" | "users.reset_password" | "roles.view" | "roles.create" | "roles.edit" | "roles.delete" | "roles.rights.edit" | "roles.assign" | "org.profile.view" | "org.profile.edit" | "audit.view" | "departments.view" | "departments.create" | "departments.edit" | "batches.view" | "batches.create" | "batches.edit"} RightCode
 * @typedef {{ type: string, id: string }} Scope
 * @typedef {{ account_id: string | null, role?: string, rights: RightCode[], scopes: Scope[], is_platform_admin: boolean }} AuthProfile
 */

export const RIGHT_CODES = [
  'users.view', 'users.create', 'users.edit', 'users.deactivate', 'users.reset_password',
  'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.rights.edit', 'roles.assign',
  'org.profile.view', 'org.profile.edit', 'audit.view',
  'departments.view', 'departments.create', 'departments.edit',
  'batches.view', 'batches.create', 'batches.edit',
]