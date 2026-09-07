import { InternalStatusClass, InternalStatusObstacle, defineCodes } from '../types';

/** 2xxx Success: the main goal was achieved. Silent. */
export const SUCCESS_CODES = defineCodes(InternalStatusClass.Success, {
    [InternalStatusObstacle.General]: {
        COMPLETED:                { code: 2000, label: 'Completed' },
        ALREADY_IN_DESIRED_STATE: { code: 2001, label: 'Already in desired state' },
    },
    [InternalStatusObstacle.Automation]: {
        /** Response submitted, a later enrichment step failed. The ending is still acceptable. */
        COMPLETED_FOLLOW_UP_FAILED: { code: 2700, label: 'Follow-up step failed' },
    },
});
