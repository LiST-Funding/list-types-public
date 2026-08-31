export const TASK_TYPE = 'referralResponse';
export const TASK_SUB_TYPE = Object.freeze({
    login: "login",
    selectPatient: "selectPatient",
    response: "response",
    onIdleTask:"onIdleTask",
});

/**
 * How a referral-response process pulls tasks and which account executes them.
 */
export const EXECUTING_ACCOUNT_MODE = Object.freeze({
    /** Each task keeps its original executing user; a process opens per user and logs in with that user's personal ehrCredentials. */
    perUserAccount: "perUserAccount",
    /** The fetch-task API replaces the executing user with a facility-designated account; a process opens per facility account and pulls that designated user's credentials like a regular user. */
    perFacilityAccount: "perFacilityAccount",
    /** The fetch-task function overrides the executing user so all tasks run on a single process/account; credentials come from the ehrConfig document, the way the scraper logs in. */
    fixedAccount: "fixedAccount",
});
export type ExecutingAccountMode = typeof EXECUTING_ACCOUNT_MODE[keyof typeof EXECUTING_ACCOUNT_MODE];