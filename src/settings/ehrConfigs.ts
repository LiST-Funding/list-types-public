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
