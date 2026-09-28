import type { InternalStatusCode } from './index';

/**
 * Where the domain knowledge lives.
 *
 * The registry is deliberately generic: no PCC, eligibility, referral or portal wording
 * in any code or label. Every portal specific string is translated here, in one file, so
 * the leak is contained and reviewable instead of spread across 24 entries.
 *
 * `satisfies` is what makes these maps safe: a value that is not a registered code fails
 * the build rather than rendering as a blank cell in the dashboard.
 */

/** Free-form `Task.statusCode` strings emitted today, mapped to the new numeric codes. */
export const LEGACY_STATUS_CODE_MAP = Object.freeze({
    placed_elsewhere:             3202,
    referral_not_found_in_portal: 3100,
    patient_not_found:            3100,
    site_not_found:               3100,
    fetch_patient_source_failed:  3300,
    needCredentials:              4400,
    needPasswordReset:            4401,
    loginError:                   5700,
} as const) satisfies Readonly<Record<string, InternalStatusCode>>;

export type LegacyStatusCode = keyof typeof LEGACY_STATUS_CODE_MAP;

/**
 * AllScripts response status as the portal reports it.
 *
 * `null` means respondable, so there is no obstacle and no code. `Placed Here` gets
 * `3201` only when a pre-flight check finds the controls locked, never from this map and
 * never from a catch block.
 */
export const ALLSCRIPTS_RESPONSE_STATUS_TO_CODE = Object.freeze({
    'Placed Elsewhere':              3202,
    'Placed Here':                   null,
    'Waiting for your response':     null,
    "Waiting for sender's response": null,
} as const) satisfies Readonly<Record<string, InternalStatusCode | null>>;

export type AllscriptsResponseStatus = keyof typeof ALLSCRIPTS_RESPONSE_STATUS_TO_CODE;
