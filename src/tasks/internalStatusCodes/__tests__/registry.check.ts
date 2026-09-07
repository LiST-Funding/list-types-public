/**
 * Registry check suite. Run with `npm run check:internalStatusCodes`.
 *
 * The split with `defineCodes` and the barrel is deliberate:
 *   module load asserts structural invariants that must never be importable when broken
 *     (four digit code, class digit matches the file, obstacle digit matches the group it
 *      is filed under, unique code, unique key, deprecated entries carry a live
 *      replacedBy). `npm run build` imports the built module so a wrong code fails the
 *      build here instead of surfacing at boot in a consumer.
 *   this suite asserts the intent that a structurally valid registry could still get
 *     wrong (the rendered strings the dashboard shows, the alarm truth table, severity
 *     order, label hygiene, legacy map coverage), plus that each load time assert still
 *     fires, so the runtime guard cannot rot silently.
 *
 * Structure only. No patient values anywhere in here.
 */
import {
    ALLSCRIPTS_RESPONSE_STATUS_TO_CODE,
    InternalStatusObstacle,
    ALL_INTERNAL_STATUS_CODE_ENTRIES,
    CLASS_LABEL,
    INTERNAL_STATUS_CODES,
    InternalStatusClass,
    LEGACY_STATUS_CODE_MAP,
    OBSTACLE_LABEL,
    SEVERITY_ORDER,
    aggregateInternalStatusCode,
    classOf,
    defineCodes,
    describeInternalStatusCode,
    formatInternalStatusCode,
    isLegacyOutcome,
    isRegisteredInternalStatusCode,
    obstacleOf,
    shouldAlert,
} from '../index';

let failures = 0;

const check = (name: string, fn: () => void): void => {
    try {
        fn();
        console.log(`  ok    ${name}`);
    } catch (error) {
        failures += 1;
        console.error(`  FAIL  ${name}: ${(error as Error).message}`);
    }
};

const assert = (condition: boolean, message: string): void => {
    if (!condition) throw new Error(message);
};

const equal = <T>(actual: T, expected: T, message: string): void => {
    if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
};

/** Asserts that a load time guard fires, and that it fires for the stated reason. */
const throws = (fn: () => unknown, expected: string, message: string): void => {
    try {
        fn();
    } catch (error) {
        const actual = (error as Error).message;
        if (!actual.includes(expected)) {
            throw new Error(`${message}: expected a message containing "${expected}", got "${actual}"`);
        }
        return;
    }
    throw new Error(`${message}: expected a throw, got none`);
};

/** The registry as the spec table declares it. Kept literal so a silent edit fails here. */
const EXPECTED_RENDERED: ReadonlyArray<readonly [number, string, string]> = [
    [1000, 'NOT_PICKED_UP', 'Pending; Not picked up'],
    [1400, 'AWAITING_CREDENTIALS', 'Pending; Authorization; Awaiting credentials'],
    [2000, 'COMPLETED', 'Success; Completed'],
    [2001, 'ALREADY_IN_DESIRED_STATE', 'Success; Already in desired state'],
    [2700, 'COMPLETED_FOLLOW_UP_FAILED', 'Success; Automation; Follow-up step failed'],
    [3100, 'TARGET_NOT_FOUND', 'External; Not found'],
    [3200, 'LOCKED_UNASSIGNED', 'External; Exists but cannot change; Unassigned'],
    [3201, 'LOCKED_ASSIGNED_HERE', 'External; Exists but cannot change; Assigned here'],
    [3202, 'LOCKED_ASSIGNED_ELSEWHERE', 'External; Exists but cannot change; Assigned elsewhere'],
    [3203, 'CONFLICTING_STATE', 'External; Exists but cannot change; Conflicting state'],
    [3300, 'EXTERNAL_SYSTEM_UNAVAILABLE', 'External; Unavailable'],
    [3400, 'NO_ACCESS_TO_TARGET', 'External; Authorization; No access to target'],
    [4400, 'CREDENTIALS_REJECTED', 'Tenant input; Authorization; Credentials rejected'],
    [4401, 'PASSWORD_RESET_REQUIRED', 'Tenant input; Authorization; Password reset required'],
    [4402, 'SECOND_FACTOR_REQUIRED', 'Tenant input; Authorization; Second factor required'],
    [4500, 'RECORD_NAME_MISMATCH', 'Tenant input; Data mismatch; Name'],
    [4501, 'RECORD_DOB_MISMATCH', 'Tenant input; Data mismatch; Date of birth'],
    [4502, 'RECORD_IDENTIFIER_INVALID', 'Tenant input; Data mismatch; Identifier invalid'],
    [4600, 'REQUIRED_CONFIGURATION_MISSING', 'Tenant input; Configuration; Required setting missing'],
    [5000, 'UNHANDLED_ERROR', 'Unexpected; Unhandled error'],
    [5700, 'ELEMENT_NOT_FOUND', 'Unexpected; Automation; Element not found'],
    [5701, 'OPERATION_TIMED_OUT', 'Unexpected; Automation; Timed out'],
    [5702, 'SESSION_LOST', 'Unexpected; Automation; Session lost'],
    [5703, 'ACTION_NOT_CONFIRMED', 'Unexpected; Automation; Action not confirmed'],
];

console.log('internalStatusCode registry');

check('the registry holds exactly the declared codes', () => {
    equal(ALL_INTERNAL_STATUS_CODE_ENTRIES.length, EXPECTED_RENDERED.length, 'entry count');
    for (const [code, key] of EXPECTED_RENDERED) {
        const entry = INTERNAL_STATUS_CODES[key as keyof typeof INTERNAL_STATUS_CODES];
        assert(entry !== undefined, `${key} is missing`);
        equal(entry.code as number, code, `${key} code`);
    }
});

check('every entry key matches its object key', () => {
    for (const [key, entry] of Object.entries(INTERNAL_STATUS_CODES)) {
        equal(entry.key as string, key, `injected key for ${key}`);
    }
});

check('every entry carries the obstacle it was filed under', () => {
    for (const entry of ALL_INTERNAL_STATUS_CODE_ENTRIES) {
        equal(entry.obstacle, obstacleOf(entry.code), `filed obstacle for ${entry.key}`);
    }
});

check('defineCodes rejects a code whose digits contradict its group', () => {
    throws(
        () =>
            defineCodes(InternalStatusClass.External, {
                [InternalStatusObstacle.StateConflict]: { LOCKED_ASSIGNED_HERE: { code: 3301 } },
            }),
        'declared under obstacle 200 but its digits say 300',
        'wrong obstacle digit',
    );
    throws(
        () =>
            defineCodes(InternalStatusClass.External, {
                [InternalStatusObstacle.Authorization]: { NO_ACCESS_TO_TARGET: { code: 4400 } },
            }),
        'declared in class 3000 but its digits say 4000',
        'wrong class digit',
    );
    throws(
        () => defineCodes(InternalStatusClass.External, { 800: { SOMETHING: { code: 3800 } } }),
        'obstacle 800 in class 3000 is not declared',
        'undeclared obstacle',
    );
    throws(
        () =>
            defineCodes(InternalStatusClass.External, {
                [InternalStatusObstacle.General]: { SHORT: { code: 30 } },
            }),
        'is not a four digit integer',
        'not four digits',
    );
    throws(
        () =>
            defineCodes(InternalStatusClass.External, {
                [InternalStatusObstacle.StateConflict]: {
                    FIRST:  { code: 3200 },
                    SECOND: { code: 3200 },
                },
            }),
        'declared twice',
        'duplicate code inside one group',
    );
    throws(
        () =>
            defineCodes(InternalStatusClass.External, {
                [InternalStatusObstacle.NotFound]:      { SAME_KEY: { code: 3100 } },
                [InternalStatusObstacle.StateConflict]: { SAME_KEY: { code: 3200 } },
            }),
        'key SAME_KEY declared twice',
        'duplicate key across groups',
    );
});

check('each code renders exactly the string the dashboard shows', () => {
    for (const [code, key, rendered] of EXPECTED_RENDERED) {
        equal(describeInternalStatusCode(code), rendered, `describe ${key}`);
        equal(formatInternalStatusCode(code), `${code} - ${rendered}`, `format ${key}`);
    }
});

check('an unregistered code still renders from its digits', () => {
    equal(describeInternalStatusCode(3299), 'External; Exists but cannot change', 'unregistered xx');
    equal(describeInternalStatusCode(6000), 'Class 6000', 'unallocated class');
    equal(describeInternalStatusCode(3800), 'External; Obstacle 800', 'reserved obstacle');
    assert(!isRegisteredInternalStatusCode(3299), '3299 must not be registered');
});

check('a label is omitted when class plus obstacle already say it', () => {
    for (const entry of ALL_INTERNAL_STATUS_CODE_ENTRIES) {
        const bucket = ALL_INTERNAL_STATUS_CODE_ENTRIES.filter(
            (other) => classOf(other.code) === classOf(entry.code) && obstacleOf(other.code) === obstacleOf(entry.code),
        );
        if (bucket.length > 1) {
            assert(!!entry.label, `${entry.key} shares its bucket and needs a label`);
        }
    }
});

check('no label repeats its own class or obstacle label', () => {
    const reserved = new Set(
        [...Object.values(CLASS_LABEL), ...Object.values(OBSTACLE_LABEL)].map((label) => label.toLowerCase()),
    );
    for (const entry of ALL_INTERNAL_STATUS_CODE_ENTRIES) {
        if (!entry.label) continue;
        assert(!reserved.has(entry.label.toLowerCase()), `${entry.key} label repeats a level label`);
    }
});

check('codes carry no domain wording', () => {
    const banned = ['pcc', 'allscripts', 'aidin', 'ensocare', 'navi', 'epic', 'referral', 'eligibility', 'payer', 'facility'];
    for (const entry of ALL_INTERNAL_STATUS_CODE_ENTRIES) {
        const text = `${entry.key} ${entry.label ?? ''}`.toLowerCase();
        for (const word of banned) {
            assert(!text.includes(word), `${entry.key} mentions "${word}"; codes are generic`);
        }
    }
});

check('shouldAlert alarms on 5xxx and on a nullish code, and is silent otherwise', () => {
    equal(shouldAlert(undefined), true, 'undefined is legacy and still alarms');
    equal(shouldAlert(null), true, 'null is legacy and still alarms');
    for (const [code] of EXPECTED_RENDERED) {
        equal(shouldAlert(code), code >= 5000, `shouldAlert(${code})`);
    }
    equal(shouldAlert(6000), true, 'a class above 5000 pages by default, by decision');
});

check('isLegacyOutcome is the migration burndown predicate', () => {
    equal(isLegacyOutcome({ status: 'error' }), true, 'error with no code');
    equal(isLegacyOutcome({ status: 'error', internalStatusCode: null }), true, 'error with null code');
    equal(isLegacyOutcome({ status: 'error', internalStatusCode: 3202 }), false, 'error with a code');
    equal(isLegacyOutcome({ status: 'done' }), false, 'not an error');
});

check('severity order covers every class and is not numeric order', () => {
    equal(SEVERITY_ORDER.length, Object.keys(InternalStatusClass).length, 'severity order covers every class');
    for (const cls of Object.values(InternalStatusClass)) {
        assert(SEVERITY_ORDER.includes(cls), `class ${cls} missing from SEVERITY_ORDER`);
    }
    assert(
        SEVERITY_ORDER.indexOf(InternalStatusClass.Pending) > SEVERITY_ORDER.indexOf(InternalStatusClass.TenantInput),
        'a pending task is not finished, so Pending outranks TenantInput',
    );
    equal(SEVERITY_ORDER[SEVERITY_ORDER.length - 1], InternalStatusClass.Unexpected, 'Unexpected always wins');
});

check('aggregation does not let a lock mask a success', () => {
    equal(aggregateInternalStatusCode([]), undefined, 'no sub-results');
    equal(aggregateInternalStatusCode([null, undefined]), undefined, 'no code on any sub-result');
    equal(aggregateInternalStatusCode([2000, 3202]), 3202, 'a lock outranks a success');
    equal(aggregateInternalStatusCode([3202, 5700]), 5700, 'Unexpected always wins');
    equal(aggregateInternalStatusCode([4401, 1000]), 1000, 'Pending outranks TenantInput');
    equal(aggregateInternalStatusCode([2000, 2001]), 2000, 'a tie keeps the first');
    equal(aggregateInternalStatusCode([2000, 6000]), 6000, 'an unknown class is never masked');
});

check('every legacy mapping targets a registered code', () => {
    for (const [legacy, code] of Object.entries(LEGACY_STATUS_CODE_MAP)) {
        assert(isRegisteredInternalStatusCode(code), `${legacy} maps to unregistered ${code}`);
    }
    for (const [status, code] of Object.entries(ALLSCRIPTS_RESPONSE_STATUS_TO_CODE)) {
        assert(code === null || isRegisteredInternalStatusCode(code), `${status} maps to unregistered ${code}`);
    }
});

check('the registry is frozen at every level', () => {
    assert(Object.isFrozen(INTERNAL_STATUS_CODES), 'registry not frozen');
    for (const entry of ALL_INTERNAL_STATUS_CODE_ENTRIES) {
        assert(Object.isFrozen(entry), `${entry.key} not frozen`);
    }
});

if (failures) {
    console.error(`\n${failures} check(s) failed`);
    process.exit(1);
}
console.log('\nall checks passed');
