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
 *
 * Watch the relative paths: this folder sits under `src/tasks/`, so `../types` from here
 * resolves to the Task types, not to this file. Files in this folder use `./types`, and
 * files in `codes/` use `../types`.
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
    /** The obstacle this entry was filed under. Injected from the group it sits in. */
    readonly obstacle: number;
    /** Short label for the `xx` level only. Omit when class plus obstacle already say it. */
    readonly label?: string;
    /** Codes are never reused. Retire instead of deleting. */
    readonly deprecated?: true;
    readonly replacedBy?: number;
}

/** What a codes file writes by hand. `key` and `obstacle` come from the structure. */
export type InternalStatusCodeEntryInput = Omit<InternalStatusCodeEntry, 'key' | 'obstacle'>;

/** One codes file: entries grouped under the obstacle they belong to. */
export type InternalStatusCodeGroups = {
    readonly [obstacle: number]: Readonly<Record<string, InternalStatusCodeEntryInput>>;
};

/** `3201` -> `3000`. Fallback safe: an unregistered code still yields its class. */
export const classOf = (code: number): number => Math.floor(code / 1000) * 1000;

/** `3201` -> `200`. */
export const obstacleOf = (code: number): number => Math.floor((code % 1000) / 100) * 100;

/**
 * Is this a code at all, as opposed to `NaN`, `0`, a float or a five digit number?
 *
 * An unregistered code is still well formed and still renders from its digits, which is
 * what keeps an older consumer working against a newer writer. A malformed one is not a
 * code, so the alarm policy fails safe on it and aggregation ignores it.
 */
export const isWellFormedInternalStatusCode = (code?: number | null): code is number =>
    typeof code === 'number' && Number.isInteger(code) && code >= 1000 && code <= 9999;

const DECLARED_OBSTACLES: ReadonlySet<number> = new Set<number>(Object.values(InternalStatusObstacle));

/**
 * The flat shape a group tree collapses to: every key mapped to its finished entry.
 *
 * Indexing the mapped type by `keyof T` gives a union of the per-obstacle objects, so it
 * has to be turned back into one object, otherwise every property is `never` and the
 * `InternalStatusCode` union comes out empty.
 */
type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void
    ? I
    : never;

type Flatten<T> = { readonly [K in keyof T]: T[K] };

type FlattenGroups<T extends InternalStatusCodeGroups> = Flatten<
    UnionToIntersection<
        {
            [Z in keyof T]: { [K in keyof T[Z]]: Readonly<T[Z][K] & { key: Extract<K, string>; obstacle: Z }> };
        }[keyof T]
    >
>;

/**
 * Declares one class worth of codes, grouped by obstacle.
 *
 * The grouping is what makes a misfiled code detectable. A flat list derives the
 * obstacle from the digits, so nothing contradicts a wrong one: `3301` sitting in the
 * External file simply reads as "External, Unavailable, 01" and looks legal. The group
 * key is an independent declaration of the same fact, so the two can be compared.
 *
 * Asserts at module load, not in tests only, because a bad code is a data problem for
 * three repos and the registry must not be importable in a broken state. `npm run build`
 * imports the built module for exactly this reason. The assertions can only fail on a
 * code that is checked in wrong, so they cannot fire in production on data that was
 * previously fine.
 */
export function defineCodes<const T extends InternalStatusCodeGroups>(
    cls: InternalStatusClass,
    groups: T,
): FlattenGroups<T> {
    const out: Record<string, InternalStatusCodeEntry> = {};
    const seenCode = new Map<number, string>();

    for (const [rawObstacle, entries] of Object.entries(groups)) {
        const obstacle = Number(rawObstacle);

        if (!DECLARED_OBSTACLES.has(obstacle)) {
            throw new Error(`internalStatusCode obstacle ${rawObstacle} in class ${cls} is not declared`);
        }

        for (const [key, entry] of Object.entries(entries)) {
            if (!Number.isInteger(entry.code) || entry.code < 1000 || entry.code > 9999) {
                throw new Error(`internalStatusCode ${entry.code} (${key}) is not a four digit integer`);
            }
            if (classOf(entry.code) !== cls) {
                throw new Error(
                    `internalStatusCode ${entry.code} (${key}) is declared in class ${cls} but its digits say ${classOf(entry.code)}`,
                );
            }
            if (obstacleOf(entry.code) !== obstacle) {
                throw new Error(
                    `internalStatusCode ${entry.code} (${key}) is declared under obstacle ${obstacle} but its digits say ${obstacleOf(entry.code)}`,
                );
            }
            const duplicate = seenCode.get(entry.code);
            if (duplicate) {
                throw new Error(`internalStatusCode ${entry.code} declared twice: ${duplicate} and ${key}`);
            }
            if (out[key]) {
                throw new Error(`internalStatusCode key ${key} declared twice in class ${cls}`);
            }

            seenCode.set(entry.code, key);
            out[key] = Object.freeze({ ...entry, key, obstacle });
        }
    }

    return Object.freeze(out) as unknown as FlattenGroups<T>;
}
