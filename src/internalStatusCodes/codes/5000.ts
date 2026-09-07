import { InternalStatusClass, defineCodes } from '../types';

/** 5xxx Unexpected: our defect, timeout or infrastructure fault. The only class that alarms. */
export const UNEXPECTED_CODES = defineCodes(InternalStatusClass.Unexpected, {
    UNHANDLED_ERROR:     { code: 5000, label: 'Unhandled error' },
    /**
     * Holds a third of all sampled errors. Watch that it stays a classification and does
     * not become a dumping ground. Per incident tracking is `code` + `currentStep` + `srcType`.
     */
    ELEMENT_NOT_FOUND:   { code: 5700, label: 'Element not found' },
    OPERATION_TIMED_OUT: { code: 5701, label: 'Timed out' },
    SESSION_LOST:        { code: 5702, label: 'Session lost' },
    ACTION_NOT_CONFIRMED:{ code: 5703, label: 'Action not confirmed' },
});
