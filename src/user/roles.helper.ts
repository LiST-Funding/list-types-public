export const ROLE_NUMBER_CI = 141; // CI/Liason (Full Access)
export const ROLE_NUMBER_CLINICAL = 144; // Clinical
export const ROLE_NUMBER_CLINICAL_MANAGER = 145; // Clinical Manager (Manage Users)
export const ROLE_NUMBER_ADMINISTRATOR = 151; // Administrator (Reports Only)
export const ROLE_NUMBER_CI_MANAGER = 152; // Manager (Admin Access + Second Approval + Extra Reports)
export const ROLE_NUMBER_SNF_ADMIN = 177;
export const ROLE_NUMBER_SUPER_ADMIN_MIN = 701;
export const ROLE_NUMBER_SUPER_ADMIN_MAX = 900;

export function isSuperAdmin(roleNumber?: number | null): boolean {
  if (roleNumber == null) return false;
  return roleNumber >= ROLE_NUMBER_SUPER_ADMIN_MIN && roleNumber <= ROLE_NUMBER_SUPER_ADMIN_MAX;
}

export function isAdmin(roleNumber?: number | null): boolean {
  if (roleNumber == null) return false;
  return (
    isSuperAdmin(roleNumber) ||
    roleNumber === ROLE_NUMBER_SNF_ADMIN ||
    roleNumber === ROLE_NUMBER_CI_MANAGER
  );
}

export function isReportsAdmin(roleNumber?: number | null): boolean {
  if (roleNumber == null) return false;
  return (
    isSuperAdmin(roleNumber) ||
    roleNumber === ROLE_NUMBER_SNF_ADMIN ||
    roleNumber === ROLE_NUMBER_CI_MANAGER ||
    roleNumber === ROLE_NUMBER_ADMINISTRATOR ||
    roleNumber === ROLE_NUMBER_CLINICAL_MANAGER
  );
}
