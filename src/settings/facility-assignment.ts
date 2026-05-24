/**
 * Represents a mapping between an EHR facility name and an internal facility configuration.
 *
 * Each patient arrives from an EHR system (identified by `srcType`) and carries a facility name
 * (`siteName`) as it appears in that EHR. This document links that EHR-side name to the
 * corresponding `facility_settings` record in our system, enabling facility resolution
 * during patient ingestion and reporting.
 *
 * Replaces the legacy `facility_settings.ehrNames` map, which embedded the same data
 * inside each facility_settings document as `ehrNames[srcType] = siteName`.
 *
 * each  [srcType X siteName] can be attached to only one facility_settings,
 * but each facility_settings can have multiple [srcType X siteName] entries
 */
export interface FacilityAssignment {
  _id?: string;

  /** The EHR system type (e.g. "Navi", "Epic", "AllScripts"). Identifies which EHR integration produced this facility name. */
  srcType: string;

  /** The facility name as it appears in the EHR system. This is the EHR's truth for what the facility is called. */
  siteName: string;

  /** Reference to the `facility_settings` document. Links this EHR facility name to our internal facility configuration. */
  facility_settings_id: string;
}
