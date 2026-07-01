/** Defines the configuration for an external account stored in secret manager */
export interface ExternalAccountConfig {
  /** The service string that displays in the UI */
  displayName: string;

  /** The type which the credentials are stored under in the secret manager (e.g. "Aidin", "PCC") */
  type: string;

  /** The task type that is used for login validation (e.g. "referralResponse") */
  loginTaskType: string;

  /** The task subtype which is used for the credential check task (e.g. "login", "checkLogin") */
  loginTaskSubType?: string;

  /** Whether this account is visible for credential updates in the UI */
  isEnabled: boolean;
}

export interface RegionNewVersionPages {
  jobInfo?: boolean;
  referralResponseReport?: boolean;
}

/** Defines which system srcTypes are enabled for the referral response feature */
export type RegionReferralResponse = Record<string, boolean>;

/** Defines the external accounts that are enabled to be stored in secret manager */
export type RegionExternalAccounts = Record<string, ExternalAccountConfig>;

/** Defines region-specific feature flags and configurations */
export interface RegionUiSettings {
  newVersionPages?: RegionNewVersionPages;

  /** Defines which system srcTypes are enabled for the referral response feature */
  referralResponse?: RegionReferralResponse;

  /** Defines the external accounts that are enabled to be stored in secret manager */
  externalAccounts?: RegionExternalAccounts;

  /** Whether SMS is available for this region (drives client SMS UI visibility). Absent/false ⇒ unavailable. */
  smsEnabled?: boolean;
}
