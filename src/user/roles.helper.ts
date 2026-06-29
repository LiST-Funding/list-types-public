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

// Authorization for managing another user's stored EHR credentials (SNF-370):
// the SNF-admin tier (177) and every higher role number may act on a foreign
// user's credentials. Every role below 177 is excluded — CI (141), Clinical
// (144), Clinical Manager (145), Administrator (151) and Manager (152). This is
// NOT a subset of `isAdmin`: `isAdmin` allows the Manager (152) tier this
// excludes, while this allows any role >= 177 that `isAdmin` does not.
export function canManageUserCredentials(roleNumber?: number | null): boolean {
  if (roleNumber == null) return false;
  return roleNumber >= ROLE_NUMBER_SNF_ADMIN;
}
