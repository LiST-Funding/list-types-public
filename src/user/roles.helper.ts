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
