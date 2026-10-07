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
    isWellFormedInternalStatusCode,
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

/** The obstacle and entry parts of a code, without its class. */
const reasonPartsOf = (code: number): string[] => {
    const parts: string[] = [];

    const obstacle = obstacleOf(code);
    if (obstacle !== InternalStatusObstacle.General) {
        parts.push(obstacleLabelOf(obstacle) ?? `Obstacle ${obstacle}`);
    }

    const label = BY_CODE.get(code)?.label;
    if (label) parts.push(label);

    return parts;
};

const classPartOf = (code: number): string => {
    const cls = classOf(code);
    return classLabelOf(cls) ?? `Class ${cls}`;
};

/**
 * `3201` -> `"External; Exists but cannot change; Assigned here"`.
 *
 * The fallbacks are load bearing: an unregistered code still renders from its digits, so
 * a consumer built against an older tag shows a code emitted by a newer Puppeteer instead
 * of a blank cell.
 */
export const describeInternalStatusCode = (code: number): string =>
    [classPartOf(code), ...reasonPartsOf(code)].join('; ');

/**
 * `4500` -> `"Data mismatch; Name"`: the description without its class, for a reader that
 * already shows what the class means, such as a support warning row. Falls back like
 * {@link describeInternalStatusCode}; a code with neither an obstacle nor a label gives its
 * class.
 */
export const describeInternalStatusCodeReason = (code: number): string => {
    const parts = reasonPartsOf(code);
    return parts.length ? parts.join('; ') : classPartOf(code);
};

/** `3201` -> `"3201 - External; Exists but cannot change; Assigned here"`. */
export const formatInternalStatusCode = (code: number): string =>
    `${code} - ${describeInternalStatusCode(code)}`;

/**
 * THE alarm policy for a code. Imported, never reimplemented, in Server, Puppeteer and
 * LogsCenter. Prefer {@link shouldAlertTask}, which carries the whole rule.
 *
 * The code only ever downgrades a failure: absent or `>= 5000` alarms, and `1xxx` to
 * `4xxx` is the case where an error is reclassified as a warning. It never upgrades a
 * task that did not fail, which is why the task level rule tests `status` first.
 *
 * Absent means the throw site is not migrated yet, so today's alerting is preserved
 * through the whole rollout. `>= 5000` rather than class equality is a deliberate
 * decision: any class allocated above 5000 pages by default, so allocating one is an
 * alerting decision and not a free reservation.
 *
 * Fails safe on anything that is not a code. `NaN` reaching this must not buy silence,
 * and a malformed value is not evidence that the outcome was acceptable.
 */
export const shouldAlert = (code?: number | null): boolean =>
    !isWellFormedInternalStatusCode(code) || code >= InternalStatusClass.Unexpected;

/**
 * THE alarm rule, whole:
 *
 *     status === 'error' && (no code || code >= 5000)
 *
 * `status` decides whether anything failed. The code only decides whether that failure
 * deserves a page, so a `2xxx` or `3xxx` error becomes a warning instead of an alarm.
 */
export const shouldAlertTask = (task: { status?: string; internalStatusCode?: number | null }): boolean =>
    task.status === 'error' && shouldAlert(task.internalStatusCode);

/**
 * When the same silent outcome stops being the customer's problem. One mismatched record is
 * theirs to fix; the same code on task after task points upstream of them, at us or a vendor
 * (a vendor dropping a field from every request turns every check into a mismatch). Starting
 * values, chosen without production counts: tune them here, never per reader.
 */
export const SILENT_BURST = Object.freeze({ threshold: 5, windowMs: 60 * 60 * 1000 });

/** One task as {@link silentBurstIndexes} reads it. `at` is epoch ms, null when unknown. */
export interface TaskOutcomeAt {
    status?: string;
    internalStatusCode?: number | null;
    at?: number | null;
}

/**
 * The indexes into `tasks` of the failures that form a burst: at least `threshold` failed tasks
 * with the same silent code whose times all fall within one `windowMs` span, both ends included.
 * Only well formed silent codes on failed tasks count, each code on its own, and a task whose
 * time is unknown never counts, so a burst always rests on evidence.
 *
 * It reads the tasks, never the clock: the same list always gives the same answer, so a burst
 * stays an error like any other until it is acknowledged or leaves the list, instead of quietly
 * clearing itself an hour later.
 */
export const silentBurstIndexes = (
    tasks: readonly TaskOutcomeAt[],
    burst: { readonly threshold: number; readonly windowMs: number } = SILENT_BURST,
): ReadonlySet<number> => {
    const failuresByCode = new Map<number, { index: number; at: number }[]>();
    tasks.forEach((task, index) => {
        const code = task.internalStatusCode;
        if (task.status !== 'error' || !isWellFormedInternalStatusCode(code) || shouldAlert(code)) return;
        if (task.at == null || !Number.isFinite(task.at)) return;
        failuresByCode.set(code, [...(failuresByCode.get(code) ?? []), { index, at: task.at }]);
    });

    const members = new Set<number>();
    for (const failures of failuresByCode.values()) {
        const byTime = [...failures].sort((a, b) => a.at - b.at);
        let first = 0;
        byTime.forEach((failure, last) => {
            while (failure.at - byTime[first].at > burst.windowMs) first += 1;
            if (last - first + 1 < burst.threshold) return;
            byTime.slice(first, last + 1).forEach(({ index }) => members.add(index));
        });
    }
    return members;
};

/** No code yet on a failed task: the throw site is not migrated. The migration burndown metric. */
export const isLegacyOutcome = (task: { status?: string; internalStatusCode?: number | null }): boolean =>
    task.status === 'error' && task.internalStatusCode == null;

/**
 * Precedence for folding sub-results into one code, lowest first. Deliberately not the
 * numeric order.
 *
 * This is advisory, not how the field is written. `internalStatusCode` lives separately
 * from `status`, and the last write wins: whichever throw site emits last sets the value
 * on the document. Nothing merges sub-results on the write path today.
 *
 * It exists for the readers that do need one code out of many, since eligibility runs
 * one sub-process per payer and a multi site referral produces one result per site.
 * `Success` sits lowest on purpose: a task that also hit a lock or is still pending has
 * a more informative code than "one of the sites worked". `Unexpected` is highest, so a
 * defect is never folded away.
 */
export const SEVERITY_ORDER = Object.freeze([
    InternalStatusClass.Success,     // least informative when something else also happened
    InternalStatusClass.External,
    InternalStatusClass.TenantInput,
    InternalStatusClass.Pending,     // not terminal, outranks any finished but blocked result
    InternalStatusClass.Unexpected,  // always wins, a defect is never folded away
] as const);

/**
 * The one code that represents a set of sub-results. See {@link SEVERITY_ORDER}: this is
 * for readers folding many results into one, not for the write path.
 *
 * A class this build does not know ranks above everything, so a code emitted by a newer
 * Puppeteer surfaces instead of being folded away. Malformed values are dropped rather
 * than ranked, otherwise a `NaN` would outrank every real code and then read as silent.
 */
export const aggregateInternalStatusCode = (
    codes: readonly (number | null | undefined)[],
): number | undefined => {
    const present = codes.filter(isWellFormedInternalStatusCode);
    if (!present.length) return undefined;

    const rank = (code: number): number => {
        const index = SEVERITY_ORDER.indexOf(classOf(code) as (typeof SEVERITY_ORDER)[number]);
        return index === -1 ? SEVERITY_ORDER.length : index;
    };

    return present.reduce((worst, code) => (rank(code) > rank(worst) ? code : worst));
};
