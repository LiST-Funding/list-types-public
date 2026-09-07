/**
 * internalStatusCode, level definitions.
 *
 * A four digit code, `CZxx`:
 *   C  class     was the ending acceptable
 *   Z  obstacle  what stood in the way
 *   xx specific  the entry label
 *
 * The class digit answers "was the ending acceptable", not "did anything go wrong
 * anywhere". A response that was submitted and then failed post-response enrichment is
 * acceptable (2xxx). A response that was never submitted because a field would not fill
 * is not acceptable (5xxx).
 *
 * Nothing in this folder may import anything outside it. It is the one sub-path export
 * a browser bundle can consume, so it must stay dependency free.
 */

export const InternalStatusClass = Object.freeze({
    Pending: 1000,
    Success: 2000,
    External: 3000,
    TenantInput: 4000,
    Unexpected: 5000,
} as const);
export type InternalStatusClass = (typeof InternalStatusClass)[keyof typeof InternalStatusClass];

/**
 * One global axis. The same Z means the same thing in every class, so `4600` and `5600`
 * both mean configuration, one blaming the tenant and one blaming us.
 */
export const InternalStatusObstacle = Object.freeze({
    General: 0,
    NotFound: 100,
    StateConflict: 200,
    Unavailable: 300,
    Authorization: 400,
    DataMismatch: 500,
    Configuration: 600,
    Automation: 700,
} as const);
export type InternalStatusObstacle = (typeof InternalStatusObstacle)[keyof typeof InternalStatusObstacle];

export const CLASS_LABEL = Object.freeze({
    1000: 'Pending',
    2000: 'Success',
    3000: 'External',
    4000: 'Tenant input',
    5000: 'Unexpected',
} as const);

export const OBSTACLE_LABEL = Object.freeze({
    0: 'General',
    100: 'Not found',
    200: 'Exists but cannot change',
    300: 'Unavailable',
    400: 'Authorization',
    500: 'Data mismatch',
    600: 'Configuration',
    700: 'Automation',
} as const);

export interface InternalStatusCodeEntry {
    readonly code: number;
    /** Injected by {@link defineCodes} from the object key. Never written by hand. */
    readonly key: string;
    /** Short label for the `xx` level only. Omit when class plus obstacle already say it. */
    readonly label?: string;
    /** Codes are never reused. Retire instead of deleting. */
    readonly deprecated?: true;
    readonly replacedBy?: number;
}

export type InternalStatusCodeEntryInput = Omit<InternalStatusCodeEntry, 'key'>;

/** `3201` -> `3000`. Fallback safe: an unregistered code still yields its class. */
export const classOf = (code: number): number => Math.floor(code / 1000) * 1000;

/** `3201` -> `200`. */
export const obstacleOf = (code: number): number => Math.floor((code % 1000) / 100) * 100;

const DECLARED_OBSTACLES: ReadonlySet<number> = new Set<number>(Object.values(InternalStatusObstacle));

/**
 * Declares one class worth of codes: injects `key`, freezes every entry, and asserts at
 * module load that each code sits inside its class and uses a declared obstacle digit.
 *
 * Module load rather than test only, because a bad code is a data problem for three
 * repos and the registry must not be importable in a broken state. The assertions can
 * only fail on a code that is checked in wrong, so they cannot fire in production on
 * data that was previously fine.
 */
export function defineCodes<const T extends Record<string, InternalStatusCodeEntryInput>>(
    cls: InternalStatusClass,
    entries: T,
): Readonly<{ [K in keyof T]: Readonly<T[K] & { key: Extract<K, string> }> }> {
    const out: Record<string, InternalStatusCodeEntry> = {};
    const seen = new Map<number, string>();

    for (const [key, entry] of Object.entries(entries)) {
        if (!Number.isInteger(entry.code)) {
            throw new Error(`internalStatusCode ${entry.code} (${key}) is not an integer`);
        }
        if (entry.code < cls || entry.code >= cls + 1000) {
            throw new Error(`internalStatusCode ${entry.code} (${key}) outside class ${cls}`);
        }
        if (!DECLARED_OBSTACLES.has(obstacleOf(entry.code))) {
            throw new Error(`internalStatusCode ${entry.code} (${key}) has an undeclared obstacle digit`);
        }
        const duplicate = seen.get(entry.code);
        if (duplicate) {
            throw new Error(`internalStatusCode ${entry.code} declared twice: ${duplicate} and ${key}`);
        }
        seen.set(entry.code, key);
        out[key] = Object.freeze({ ...entry, key });
    }

    return Object.freeze(out) as unknown as Readonly<{ [K in keyof T]: Readonly<T[K] & { key: Extract<K, string> }> }>;
}
