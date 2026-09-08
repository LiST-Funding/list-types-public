/**
 * Approved Admissions' Medicaid search rules — the source of truth, maintained by hand.
 *
 * Transcribed from AA's SearchOptions export (RequiredFieldsRule / "Search combination" per
 * provider group; the copy we received is kept in the docs vault under References/). When AA
 * sends a new export, edit this object directly and run `npm test`.
 *
 * Canonical consumer import: `list-types-public/eligibility`. This is the module's ONLY
 * export: 49 provider groups, 171 combinations, 48 state codes. Everything else — which state
 * a key belongs to, which states refuse an SSN, which combination a request satisfies, labels
 * — is derived from it in each consumer: NaviHealth approvedAdmissions/v2/medicaidSearchRules.js
 * and Workflow-Front payer-eligibility/medicaid-search-rules.ts.
 *
 * AA's combination order is preserved verbatim, because consumers resolve to the first
 * satisfied combination in that order. The Medicare provider group (AA201001, one combination:
 * first + last name, date of birth, Medicare number) is what we already send and is not listed.
 */
import type { MedicaidSearchRules } from './types';

export const MEDICAID_SEARCH_RULES: MedicaidSearchRules = {
  AA201021: { state: "AL", name: "Alabama", combinations: [["MedicaidNumber"], ["LastName", "FirstName", "BirthDate"], ["Ssn", "BirthDate"]] },
  AA201024: { state: "AR", name: "Arkansas", combinations: [["MedicaidNumber", "BirthDate"], ["MedicaidNumber", "FirstName", "BirthDate"], ["MedicaidNumber", "LastName", "FirstName"], ["MedicaidNumber", "BirthDate", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201025: { state: "CA", name: "California", combinations: [["MedicaidNumber", "BirthDate"]] },
  AA201026: { state: "CO", name: "Colorado", combinations: [["MedicaidNumber", "BirthDate"], ["LastName", "FirstName", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"]] },
  AA201027: { state: "CT", name: "Connecticut", combinations: [["MedicaidNumber", "Ssn"], ["MedicaidNumber", "BirthDate"], ["Ssn", "LastName", "FirstName", "BirthDate"]] },
  AA201028: { state: "DC", name: "DC", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201029: { state: "DE", name: "Delaware", combinations: [["MedicaidNumber", "LastName", "FirstName", "BirthDate"], ["MedicaidNumber", "LastName", "BirthDate"], ["MedicaidNumber", "LastName", "FirstName"], ["MedicaidNumber", "Ssn", "BirthDate"], ["MedicaidNumber", "Ssn"], ["MedicaidNumber", "BirthDate"], ["MedicaidNumber"], ["LastName", "FirstName", "Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"], ["LastName", "Ssn", "BirthDate"]] },
  AA201030: { state: "FL", name: "Florida", combinations: [["MedicaidNumber"], ["LastName", "FirstName", "BirthDate", "Sex"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"]] },
  AA201031: { state: "GA", name: "Georgia", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "Sex", "BirthDate"]] },
  AA201033: { state: "ID", name: "Idaho", combinations: [["MedicaidNumber", "BirthDate"], ["MedicaidNumber", "Ssn"], ["MedicaidNumber", "LastName", "FirstName"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201034: { state: "IL", name: "Illinois", combinations: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201035: { state: "IN", name: "Indiana", combinations: [["MedicaidNumber"], ["Ssn"], ["LastName", "FirstName", "BirthDate"], ["MedicareNumber"]] },
  AA201036: { state: "IA", name: "Iowa", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201037: { state: "KS", name: "Kansas", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["FirstName", "LastName", "BirthDate"]] },
  AA201038: { state: "KY", name: "Kentucky", combinations: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName"]] },
  AA201039: { state: "LA", name: "Louisiana", combinations: [["MedicaidNumber", "BirthDate"], ["MedicaidNumber", "FirstName", "LastName"], ["FirstName", "LastName", "Ssn"], ["FirstName", "LastName", "BirthDate"], ["BirthDate", "Ssn"]] },
  AA201040: { state: "ME", name: "Maine", combinations: [["MedicaidNumber"], ["Ssn"], ["LastName", "FirstName", "BirthDate", "Sex"]] },
  AA201041: { state: "MD", name: "Maryland", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201042: { state: "MA", name: "Massachusetts", combinations: [["MedicaidNumber", "Ssn"], ["MedicaidNumber", "LastName", "FirstName"], ["MedicaidNumber", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201043: { state: "MI", name: "Michigan", combinations: [["MedicaidNumber"], ["Ssn"], ["LastName", "FirstName", "BirthDate", "Sex"]] },
  AA201044: { state: "MN", name: "Minnesota", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201045: { state: "MS", name: "Mississippi", combinations: [["MedicaidNumber", "BirthDate"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201046: { state: "MO", name: "Missouri", combinations: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201047: { state: "MT", name: "Montana", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201048: { state: "NE", name: "Nebraska", combinations: [["MedicaidNumber"], ["LastName", "FirstName", "BirthDate"]] },
  AA201049: { state: "NV", name: "Nevada", combinations: [["MedicaidNumber"], ["FirstName", "LastName", "BirthDate"], ["Ssn", "BirthDate"]] },
  AA201050: { state: "NH", name: "New Hampshire", combinations: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName", "BirthDate"]] },
  AA201051: { state: "NJ", name: "New Jersey", combinations: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName", "BirthDate"]] },
  AA201052: { state: "NM", name: "New Mexico", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201053: { state: "NY", name: "New York", combinations: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName", "BirthDate"]] },
  AA201054: { state: "NC", name: "North Carolina", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"]] },
  AA201055: { state: "ND", name: "North Dakota", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["MedicaidNumber", "Ssn", "BirthDate"], ["MedicaidNumber", "LastName", "BirthDate"], ["MedicaidNumber", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201056: { state: "OH", name: "Ohio", combinations: [["MedicaidNumber"], ["FirstName", "LastName", "BirthDate", "Sex"], ["Ssn", "BirthDate"], ["Ssn", "FirstName", "LastName"]] },
  AA201057: { state: "OK", name: "Oklahoma", combinations: [["MedicaidNumber", "BirthDate"], ["MedicaidNumber", "LastName"], ["LastName", "FirstName", "BirthDate"], ["MedicaidNumber", "Ssn"], ["Ssn", "LastName", "FirstName"]] },
  AA201058: { state: "OR", name: "Oregon", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201059: { state: "PA", name: "Pennsylvania", combinations: [["MedicaidNumber", "LastName", "FirstName"], ["MedicaidNumber", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201060: { state: "RI", name: "Rhode Island", combinations: [["MedicaidNumber"], ["FirstName", "LastName", "BirthDate"]] },
  AA201061: { state: "SC", name: "South Carolina", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201062: { state: "SD", name: "South Dakota", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]] },
  AA201063: { state: "TN", name: "Tennessee", combinations: [["MedicaidNumber"]] },
  AA201064: { state: "TX", name: "Texas", combinations: [["MedicaidNumber"], ["Ssn", "LastName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201065: { state: null, name: "Texas LTC", combinations: [["LastName", "FirstName", "BirthDate"], ["Ssn", "LastName"], ["Ssn", "BirthDate"], ["MedicaidNumber"]] },
  AA201066: { state: "UT", name: "Utah", combinations: [["MedicaidNumber", "LastName", "FirstName", "BirthDate"]] },
  AA201067: { state: "VT", name: "Vermont", combinations: [["MedicaidNumber"], ["MedicaidNumber", "LastName", "FirstName", "BirthDate"], ["MedicaidNumber", "BirthDate"]] },
  AA201068: { state: "VA", name: "Virginia", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201069: { state: "WA", name: "Washington", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]] },
  AA201070: { state: "WV", name: "West Virginia", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"]] },
  AA201071: { state: "WI", name: "Wisconsin", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate", "Sex"]] },
  AA201072: { state: "WY", name: "Wyoming", combinations: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate", "Sex"]] },
};
