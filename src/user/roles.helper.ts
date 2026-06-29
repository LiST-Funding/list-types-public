export const ROLE_NUMBER_FACILITY_ADMIN = 152;
export const ROLE_NUMBER_SNF_ADMIN = 177;
export const ROLE_NUMBER_SUPER_ADMIN_MIN = 701;
export const ROLE_NUMBER_SUPER_ADMIN_MAX = 900;

export function isFacilityAdmin(roleNumber?: number | null): boolean {
  return roleNumber === ROLE_NUMBER_FACILITY_ADMIN;
}

export function isSnfAdmin(roleNumber?: number | null): boolean {
  return roleNumber === ROLE_NUMBER_SNF_ADMIN;
}

export function isSuperAdmin(roleNumber?: number | null): boolean {
  if (roleNumber == null) return false;
  return roleNumber >= ROLE_NUMBER_SUPER_ADMIN_MIN && roleNumber <= ROLE_NUMBER_SUPER_ADMIN_MAX;
}

export function isAdmin(roleNumber?: number | null): boolean {
  return isFacilityAdmin(roleNumber) || isSnfAdmin(roleNumber) || isSuperAdmin(roleNumber);
}

// Authorization for managing another user's stored EHR credentials (SNF-370):
// the SNF-admin tier (177) and every higher tier may act on a foreign user's
// credentials. Deliberately excludes facility admin (152) — it sits below the
// SNF-admin tier — so this is intentionally narrower than `isAdmin`.
export function canManageUserCredentials(roleNumber?: number | null): boolean {
  if (roleNumber == null) return false;
  return roleNumber >= ROLE_NUMBER_SNF_ADMIN;
}
