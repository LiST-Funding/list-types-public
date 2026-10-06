/** One earlier referral of the same patient, as GET /snfs/patient/:patientId/previous-referrals returns it. */
export interface PreviousReferralSummary {
  referralId: string;
  receivedAt: string;
  sites: Array<{ listSiteName?: string; displayStatus?: string }>;
}
