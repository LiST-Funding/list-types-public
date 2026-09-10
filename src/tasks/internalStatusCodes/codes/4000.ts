import { InternalStatusClass, InternalStatusObstacle, defineCodes } from '../types';

/** 4xxx Tenant input: the customer must act before this can succeed. Silent. */
export const TENANT_INPUT_CODES = defineCodes(InternalStatusClass.TenantInput, {
    [InternalStatusObstacle.Authorization]: {
        CREDENTIALS_REJECTED:    { code: 4400, label: 'Credentials rejected' },
        PASSWORD_RESET_REQUIRED: { code: 4401, label: 'Password reset required' },
        SECOND_FACTOR_REQUIRED:  { code: 4402, label: 'Second factor required' },
    },
    [InternalStatusObstacle.DataMismatch]: {
        RECORD_NAME_MISMATCH:      { code: 4500, label: 'Name' },
        RECORD_DOB_MISMATCH:       { code: 4501, label: 'Date of birth' },
        RECORD_IDENTIFIER_INVALID: { code: 4502, label: 'Identifier invalid' },
    },
    [InternalStatusObstacle.Configuration]: {
        REQUIRED_CONFIGURATION_MISSING: { code: 4600, label: 'Required setting missing' },
    },
});
