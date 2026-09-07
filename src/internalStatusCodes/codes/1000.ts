import { InternalStatusClass, defineCodes } from '../types';

/** 1xxx Pending: parked, waiting on something external. Not terminal. Silent. */
export const PENDING_CODES = defineCodes(InternalStatusClass.Pending, {
    NOT_PICKED_UP:        { code: 1000, label: 'Not picked up' },
    AWAITING_CREDENTIALS: { code: 1400, label: 'Awaiting credentials' },
});
