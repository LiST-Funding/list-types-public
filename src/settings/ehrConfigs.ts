import { EXECUTING_ACCOUNT_MODE, type ExecutingAccountMode } from "../tasks/referralResponse/constants";

export interface AutoReLoginConfig {
  autoReLoginEnabled?: boolean;
  autoReLoginTime?: number;
  autoReLoginMaxAttempts?: number;
  autoReLoginMaxAttemptsTimeRange?: number;
}

export interface BaseEhrConfig {
  // General EHR fields
  fullUrl: string;
  loginPage: string;
  userDataDir: string;
  srcType: string;
  shouldLoadMore: boolean;
  browserAlertsToApprove?: string[];
  timeForAlert?: number;
  shouldSearch?: boolean;

  // SNF user fields
  snfAccountName: string;
  snfAccountId: string;

  // Credentials
  accountId: string;
  accountPassword: string;

  // Auto re-login fields (optional)
  autoReLoginEnabled?: boolean;
  autoReLoginTime?: number;
  autoReLoginMaxAttempts?: number;
  autoReLoginMaxAttemptsTimeRange?: number;
}

export interface EpicEhrConfig extends BaseEhrConfig {
  refreshListButtonId?: string;
  requestType: string;
  reportType: string;
  markAsUnReadId: string;
  listFrameButtonsBarSelector?: string;
  responseIsFromHospital_sentFromStrings?: string[];
  responseIsFromHospital_sentToStrings?: string[];
  responseIsFromSite_sentFromStrings?: string[];
  responseIsFromSite_sentToStrings?: string[];
}

export interface EnsocareEhrConfig extends BaseEhrConfig {
  ensocareProviderId: string;
}

export type EhrConfigDocument = BaseEhrConfig | EpicEhrConfig | EnsocareEhrConfig;

/**
 * ehrConfig document of a referral-response process (e.g. "aidinResponse", "ensocareResponse").
 * Extends the srcType's own config document — a response config carries all the fields of its
 * srcType (e.g. `ensocareProviderId` for Ensocare) plus the response-specific fields.
 */
export type ResponseEhrConfigDocument = EhrConfigDocument & {
    /** How the response process pulls tasks and which account executes them. */
    executingAccountMode: ExecutingAccountMode;
};

export { EXECUTING_ACCOUNT_MODE };
export type { ExecutingAccountMode };
