/**
 * internalStatusCode registry: assembly, load time assertions, lookups, composer, policy.
 *
 * This is the sub-path export `list-types-public/tasks/internalStatusCodes`. It imports
 * nothing outside this folder, so LogsCenter (a browser app) can consume it even though
 * the root barrel of this package pulls in Node only dependencies such as `exceljs` and
 * `pdf-lib`. Do not add an import here that reaches outside this folder, and note that
 * `../types` from this file is the Task types, one level up, not the level definitions.
 */
import {
    CLASS_LABEL,
    InternalStatusClass,
    InternalStatusCodeEntry,
    InternalStatusObstacle,
    OBSTACLE_LABEL,
    classOf,
    obstacleOf,
} from './types';
import { PENDING_CODES } from './codes/1000';
import { SUCCESS_CODES } from './codes/2000';
import { EXTERNAL_CODES } from './codes/3000';
import { TENANT_INPUT_CODES } from './codes/4000';
import { UNEXPECTED_CODES } from './codes/5000';

export * from './types';
export * from './legacy';
export { PENDING_CODES } from './codes/1000';
export { SUCCESS_CODES } from './codes/2000';
export { EXTERNAL_CODES } from './codes/3000';
export { TENANT_INPUT_CODES } from './codes/4000';
export { UNEXPECTED_CODES } from './codes/5000';

const CODE_GROUPS = [PENDING_CODES, SUCCESS_CODES, EXTERNAL_CODES, TENANT_INPUT_CODES, UNEXPECTED_CODES] as const;

/** Every registered entry, keyed by its stable key. */
export const INTERNAL_STATUS_CODES = Object.freeze({
    ...PENDING_CODES,
    ...SUCCESS_CODES,
    ...EXTERNAL_CODES,
    ...TENANT_INPUT_CODES,
    ...UNEXPECTED_CODES,
});

export type InternalStatusCodeKey = keyof typeof INTERNAL_STATUS_CODES;

/**
 * The registered codes. Use it at throw sites, so a writer cannot invent a number.
 * `Task.internalStatusCode` stays `number` on purpose: a reader built against an older
 * tag must still accept a code emitted by a newer Puppeteer.
 */
export type InternalStatusCode = (typeof INTERNAL_STATUS_CODES)[InternalStatusCodeKey]['code'];

export const ALL_INTERNAL_STATUS_CODE_ENTRIES: readonly InternalStatusCodeEntry[] =
    Object.freeze(Object.values(INTERNAL_STATUS_CODES) as InternalStatusCodeEntry[]);

const BY_CODE: ReadonlyMap<number, InternalStatusCodeEntry> = (() => {
    const map = new Map<number, InternalStatusCodeEntry>();
    // Uniqueness across classes. defineCodes only sees one class, so a code duplicated
    // between two files can only be caught here, and a duplicated key would be silently
    // swallowed by the spread above.
    const keyCount = CODE_GROUPS.reduce((sum, group) => sum + Object.keys(group).length, 0);
    if (keyCount !== Object.keys(INTERNAL_STATUS_CODES).length) {
        throw new Error('internalStatusCode registry has a duplicate key across classes');
    }
    for (const entry of ALL_INTERNAL_STATUS_CODE_ENTRIES) {
        const existing = map.get(entry.code);
        if (existing) {
            throw new Error(
                `internalStatusCode ${entry.code} is registered twice: ${existing.key} and ${entry.key}`,
            );
        }
        map.set(entry.code, entry);
    }
    for (const entry of ALL_INTERNAL_STATUS_CODE_ENTRIES) {
        if (entry.replacedBy !== undefined && !map.has(entry.replacedBy)) {
            throw new Error(`internalStatusCode ${entry.key} is replacedBy ${entry.replacedBy}, which is not registered`);
        }
        if (entry.deprecated && entry.replacedBy === undefined) {
            throw new Error(`internalStatusCode ${entry.key} is deprecated without a replacedBy`);
        }
    }
    return map;
})();

/** The registered entry, or `undefined` for a code this build does not know. */
export const getInternalStatusCodeEntry = (code?: number | null): InternalStatusCodeEntry | undefined =>
    code == null ? undefined : BY_CODE.get(code);

export const isRegisteredInternalStatusCode = (code?: number | null): code is InternalStatusCode =>
    code != null && BY_CODE.has(code);

const classLabelOf = (cls: number): string | undefined => (CLASS_LABEL as Record<number, string | undefined>)[cls];
const obstacleLabelOf = (obstacle: number): string | undefined =>
    (OBSTACLE_LABEL as Record<number, string | undefined>)[obstacle];

/**
 * `3201` -> `"External; Exists but cannot change; Assigned here"`.
 *
 * The fallbacks are load bearing: an unregistered code still renders from its digits, so
 * a consumer built against an older tag shows a code emitted by a newer Puppeteer instead
 * of a blank cell.
 */
export const describeInternalStatusCode = (code: number): string => {
    const cls = classOf(code);
    const parts: string[] = [classLabelOf(cls) ?? `Class ${cls}`];

    const obstacle = obstacleOf(code);
    if (obstacle !== InternalStatusObstacle.General) {
        parts.push(obstacleLabelOf(obstacle) ?? `Obstacle ${obstacle}`);
    }

    const label = BY_CODE.get(code)?.label;
    if (label) parts.push(label);

    return parts.join('; ');
};

/** `3201` -> `"3201 - External; Exists but cannot change; Assigned here"`. */
export const formatInternalStatusCode = (code: number): string =>
    `${code} - ${describeInternalStatusCode(code)}`;

/**
 * THE alarm policy. Imported, never reimplemented, in Server, Puppeteer and LogsCenter.
 *
 * Nullish means the throw site is not migrated yet, so legacy behaviour applies and
 * today's alerting is preserved through the whole rollout. `>= 5000` rather than class
 * equality is a deliberate decision: any class allocated above 5000 pages by default, so
 * allocating one is an alerting decision and not a free reservation.
 *
 * Callers apply this to a task that already ended in error. It is the alarm policy for a
 * failed outcome, not a predicate on every task, because a nullish code on a task that
 * never failed is simply an un-migrated success.
 */
export const shouldAlert = (code?: number | null): boolean => code == null || code >= InternalStatusClass.Unexpected;

/** No code yet on a failed task: the throw site is not migrated. The migration burndown metric. */
export const isLegacyOutcome = (task: { status?: string; internalStatusCode?: number | null }): boolean =>
    task.status === 'error' && task.internalStatusCode == null;

/**
 * Severity order for aggregating sub-results. Deliberately not the numeric order.
 *
 * Eligibility runs one sub-process per payer and a multi site referral produces one
 * result per site, so a single task can legitimately hold a success and a lock at once.
 * The task level code must not let the lock mask the success.
 */
export const SEVERITY_ORDER = Object.freeze([
    InternalStatusClass.Success,     // a goal was reached, that dominates benign non-outcomes
    InternalStatusClass.External,
    InternalStatusClass.TenantInput,
    InternalStatusClass.Pending,     // not terminal, outranks any finished but blocked result
    InternalStatusClass.Unexpected,  // always wins
] as const);

/**
 * The one code that represents a set of sub-results.
 *
 * A class this build does not know ranks above everything, so a code emitted by a newer
 * Puppeteer surfaces instead of being masked by a success. That matches `shouldAlert`,
 * where an unknown class above 5000 already alarms.
 */
export const aggregateInternalStatusCode = (
    codes: readonly (number | null | undefined)[],
): number | undefined => {
    const present = codes.filter((code): code is number => code != null);
    if (!present.length) return undefined;

    const rank = (code: number): number => {
        const index = SEVERITY_ORDER.indexOf(classOf(code) as (typeof SEVERITY_ORDER)[number]);
        return index === -1 ? SEVERITY_ORDER.length : index;
    };

    return present.reduce((worst, code) => (rank(code) > rank(worst) ? code : worst));
};
