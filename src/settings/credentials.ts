// SNF-370: the credential-validity vocabulary shared between the backend
// (WorkflowServer credential model) and the EHR response scrapers (NaviHealth).
// Defined once here so the two repos can never drift on the persisted values.

/** Persisted validity of a stored EHR credential. */
export type CredentialStatus = 'valid' | 'invalid';

/** Why a credential was marked invalid. */
export type CredentialInvalidReason = 'auth_failed' | 'account_locked';

/** Runtime values for {@link CredentialStatus} (for JS consumers / value checks). */
export const CREDENTIAL_STATUS = Object.freeze({
    VALID: 'valid',
    INVALID: 'invalid',
}) satisfies Record<string, CredentialStatus>;

/** Runtime values for {@link CredentialInvalidReason}. */
export const CREDENTIAL_INVALID_REASON = Object.freeze({
    AUTH_FAILED: 'auth_failed',
    ACCOUNT_LOCKED: 'account_locked',
}) satisfies Record<string, CredentialInvalidReason>;
