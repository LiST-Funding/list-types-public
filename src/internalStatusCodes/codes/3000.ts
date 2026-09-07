import { InternalStatusClass, InternalStatusObstacle, defineCodes } from '../types';

/** 3xxx External: the external system's own state legitimately prevented the goal. Silent. */
export const EXTERNAL_CODES = defineCodes(InternalStatusClass.External, {
    /** Only member of its (class, obstacle) bucket, so a label would repeat the obstacle. */
    TARGET_NOT_FOUND:            { code: 3100 },
    LOCKED_UNASSIGNED:           { code: 3200, label: 'Unassigned' },
    /**
     * Set only by a pre-flight respond availability check, never from a catch block. Its
     * failure signature overlaps a genuine fill regression, so a catch based assignment
     * would turn the one code that silences an alarm into the code that hides a bug.
     */
    LOCKED_ASSIGNED_HERE:        { code: 3201, label: 'Assigned here' },
    LOCKED_ASSIGNED_ELSEWHERE:   { code: 3202, label: 'Assigned elsewhere' },
    CONFLICTING_STATE:           { code: 3203, label: 'Conflicting state' },
    EXTERNAL_SYSTEM_UNAVAILABLE: { code: 3300 },
    NO_ACCESS_TO_TARGET:         { code: 3400, label: 'No access to target' },
});