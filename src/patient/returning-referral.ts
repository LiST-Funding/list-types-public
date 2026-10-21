/**
 * The patient's past stay found in the region's transfer history, as getOneJob and jobList return it.
 * Only these two fields leave the server; the matched transfer-report row also holds SSN and DOB.
 */
export interface ReturningReferral {
  effective_date: string;
  /** Facility id as the transfer CSV stores it. */
  fac_id: string;
}
