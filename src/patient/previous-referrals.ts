/** One earlier referral of the same patient, as GET /snfs/patient/:patientId/previous-referrals returns it. */
export interface PreviousReferralSummary {
  referralId: string;
  receivedAt: string;
  /** Raw "Last, First" as stored on that referral. */
  patientName?: string;
  /** Matching is on DOB + last name only, so a different first name may mean a different person. */
  firstNameDiffers?: boolean;
  sites: Array<{ listSiteName?: string; displayStatus?: string }>;
}
