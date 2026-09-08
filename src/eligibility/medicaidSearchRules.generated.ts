/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Written by scripts/generate-medicaid-search-rules.mjs from
 * data/aa-medicaid-search-rules.tsv (Approved Admissions' SearchOptions export).
 * Regenerate with `npm run generate:medicaid-rules`; `npm test` fails if this file
 * has drifted from the TSV.
 *
 * Canonical consumer import: `list-types-public/eligibility`.
 *
 * Contents: 49 Medicaid provider groups holding 171 search
 * combinations, and 48 state codes — every jurisdiction AA publishes Medicaid
 * rules for. A state absent from AA's export has no code here. AA's combination order is
 * preserved verbatim, because consumers resolve to the first satisfied combination in that
 * order.
 *
 * DATA ONLY. This package carries the rules and the maps needed to read them; the logic that
 * interprets them (which combination a request satisfies, labels, allowlist checks) lives in
 * each consumer: NaviHealth approvedAdmissions/v2/medicaidSearchRules.js and Workflow-Front
 * payer-eligibility/medicaid-search-rules.ts.
 */
import type { MedicaidSearchRules, SearchCombination } from './types';

/** The two-letter codes AA publishes Medicaid rules for. Texas LTC (AA201065) is a second
 *  Texas program and has no code of its own; its rules are reachable by provider key. */
export type MedicaidStateCode =
  | "AL"
  | "AR"
  | "CA"
  | "CO"
  | "CT"
  | "DC"
  | "DE"
  | "FL"
  | "GA"
  | "IA"
  | "ID"
  | "IL"
  | "IN"
  | "KS"
  | "KY"
  | "LA"
  | "MA"
  | "MD"
  | "ME"
  | "MI"
  | "MN"
  | "MO"
  | "MS"
  | "MT"
  | "NC"
  | "ND"
  | "NE"
  | "NH"
  | "NJ"
  | "NM"
  | "NV"
  | "NY"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VA"
  | "VT"
  | "WA"
  | "WI"
  | "WV"
  | "WY";

/** AA's Medicare provider group. Its rules live in MEDICARE_SEARCH_RULE, never in
 *  MEDICAID_SEARCH_RULES. */
export const MEDICARE_PROVIDER_KEY = "AA201001";

/** AA accepts exactly one combination for Medicare, which is what we already send. */
export const MEDICARE_SEARCH_RULE: SearchCombination = ["FirstName", "LastName", "BirthDate", "MedicareNumber"];

/** Every Medicaid provider group's accepted search combinations, in AA's own order. */
export const MEDICAID_SEARCH_RULES: MedicaidSearchRules = {
  // Alabama
  AA201021: [["MedicaidNumber"], ["LastName", "FirstName", "BirthDate"], ["Ssn", "BirthDate"]],
  // Arkansas
  AA201024: [["MedicaidNumber", "BirthDate"], ["MedicaidNumber", "FirstName", "BirthDate"], ["MedicaidNumber", "LastName", "FirstName"], ["MedicaidNumber", "BirthDate", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // California
  AA201025: [["MedicaidNumber", "BirthDate"]],
  // Colorado
  AA201026: [["MedicaidNumber", "BirthDate"], ["LastName", "FirstName", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"]],
  // Connecticut
  AA201027: [["MedicaidNumber", "Ssn"], ["MedicaidNumber", "BirthDate"], ["Ssn", "LastName", "FirstName", "BirthDate"]],
  // DC
  AA201028: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // Delaware
  AA201029: [["MedicaidNumber", "LastName", "FirstName", "BirthDate"], ["MedicaidNumber", "LastName", "BirthDate"], ["MedicaidNumber", "LastName", "FirstName"], ["MedicaidNumber", "Ssn", "BirthDate"], ["MedicaidNumber", "Ssn"], ["MedicaidNumber", "BirthDate"], ["MedicaidNumber"], ["LastName", "FirstName", "Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"], ["LastName", "Ssn", "BirthDate"]],
  // Florida
  AA201030: [["MedicaidNumber"], ["LastName", "FirstName", "BirthDate", "Sex"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"]],
  // Georgia
  AA201031: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "Sex", "BirthDate"]],
  // Idaho
  AA201033: [["MedicaidNumber", "BirthDate"], ["MedicaidNumber", "Ssn"], ["MedicaidNumber", "LastName", "FirstName"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Illinois
  AA201034: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Indiana
  AA201035: [["MedicaidNumber"], ["Ssn"], ["LastName", "FirstName", "BirthDate"], ["MedicareNumber"]],
  // Iowa
  AA201036: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Kansas
  AA201037: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["FirstName", "LastName", "BirthDate"]],
  // Kentucky
  AA201038: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName"]],
  // Louisiana
  AA201039: [["MedicaidNumber", "BirthDate"], ["MedicaidNumber", "FirstName", "LastName"], ["FirstName", "LastName", "Ssn"], ["FirstName", "LastName", "BirthDate"], ["BirthDate", "Ssn"]],
  // Maine
  AA201040: [["MedicaidNumber"], ["Ssn"], ["LastName", "FirstName", "BirthDate", "Sex"]],
  // Maryland
  AA201041: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Massachusetts
  AA201042: [["MedicaidNumber", "Ssn"], ["MedicaidNumber", "LastName", "FirstName"], ["MedicaidNumber", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Michigan
  AA201043: [["MedicaidNumber"], ["Ssn"], ["LastName", "FirstName", "BirthDate", "Sex"]],
  // Minnesota
  AA201044: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // Mississippi
  AA201045: [["MedicaidNumber", "BirthDate"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // Missouri
  AA201046: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // Montana
  AA201047: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Nebraska
  AA201048: [["MedicaidNumber"], ["LastName", "FirstName", "BirthDate"]],
  // Nevada
  AA201049: [["MedicaidNumber"], ["FirstName", "LastName", "BirthDate"], ["Ssn", "BirthDate"]],
  // New Hampshire
  AA201050: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName", "BirthDate"]],
  // New Jersey
  AA201051: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName", "BirthDate"]],
  // New Mexico
  AA201052: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // New York
  AA201053: [["MedicaidNumber"], ["Ssn", "LastName", "FirstName", "BirthDate"]],
  // North Carolina
  AA201054: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"]],
  // North Dakota
  AA201055: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["MedicaidNumber", "Ssn", "BirthDate"], ["MedicaidNumber", "LastName", "BirthDate"], ["MedicaidNumber", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // Ohio
  AA201056: [["MedicaidNumber"], ["FirstName", "LastName", "BirthDate", "Sex"], ["Ssn", "BirthDate"], ["Ssn", "FirstName", "LastName"]],
  // Oklahoma
  AA201057: [["MedicaidNumber", "BirthDate"], ["MedicaidNumber", "LastName"], ["LastName", "FirstName", "BirthDate"], ["MedicaidNumber", "Ssn"], ["Ssn", "LastName", "FirstName"]],
  // Oregon
  AA201058: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Pennsylvania
  AA201059: [["MedicaidNumber", "LastName", "FirstName"], ["MedicaidNumber", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Rhode Island
  AA201060: [["MedicaidNumber"], ["FirstName", "LastName", "BirthDate"]],
  // South Carolina
  AA201061: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // South Dakota
  AA201062: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["LastName", "FirstName", "BirthDate"]],
  // Tennessee
  AA201063: [["MedicaidNumber"]],
  // Texas
  AA201064: [["MedicaidNumber"], ["Ssn", "LastName"], ["LastName", "FirstName", "BirthDate"]],
  // Texas LTC
  AA201065: [["LastName", "FirstName", "BirthDate"], ["Ssn", "LastName"], ["Ssn", "BirthDate"], ["MedicaidNumber"]],
  // Utah
  AA201066: [["MedicaidNumber", "LastName", "FirstName", "BirthDate"]],
  // Vermont
  AA201067: [["MedicaidNumber"], ["MedicaidNumber", "LastName", "FirstName", "BirthDate"], ["MedicaidNumber", "BirthDate"]],
  // Virginia
  AA201068: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // Washington
  AA201069: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate"]],
  // West Virginia
  AA201070: [["MedicaidNumber"], ["Ssn", "BirthDate"]],
  // Wisconsin
  AA201071: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate", "Sex"]],
  // Wyoming
  AA201072: [["MedicaidNumber"], ["Ssn", "BirthDate"], ["Ssn", "LastName", "FirstName"], ["LastName", "FirstName", "BirthDate", "Sex"]],
};

/** State code -> AA provider key. TX maps to AA201064, matching what Workflow-Front
 *  already sends; Texas LTC is deliberately absent. */
export const MEDICAID_PROVIDER_KEY_BY_STATE: Readonly<Record<MedicaidStateCode, string>> = {
  AL: "AA201021",
  AR: "AA201024",
  CA: "AA201025",
  CO: "AA201026",
  CT: "AA201027",
  DC: "AA201028",
  DE: "AA201029",
  FL: "AA201030",
  GA: "AA201031",
  IA: "AA201036",
  ID: "AA201033",
  IL: "AA201034",
  IN: "AA201035",
  KS: "AA201037",
  KY: "AA201038",
  LA: "AA201039",
  MA: "AA201042",
  MD: "AA201041",
  ME: "AA201040",
  MI: "AA201043",
  MN: "AA201044",
  MO: "AA201046",
  MS: "AA201045",
  MT: "AA201047",
  NC: "AA201054",
  ND: "AA201055",
  NE: "AA201048",
  NH: "AA201050",
  NJ: "AA201051",
  NM: "AA201052",
  NV: "AA201049",
  NY: "AA201053",
  OH: "AA201056",
  OK: "AA201057",
  OR: "AA201058",
  PA: "AA201059",
  RI: "AA201060",
  SC: "AA201061",
  SD: "AA201062",
  TN: "AA201063",
  TX: "AA201064",
  UT: "AA201066",
  VA: "AA201068",
  VT: "AA201067",
  WA: "AA201069",
  WI: "AA201071",
  WV: "AA201070",
  WY: "AA201072",
};

/** The inverse of MEDICAID_PROVIDER_KEY_BY_STATE. Generated rather than derived at load
 *  so that neither direction can be built with an unchecked key cast. */
export const STATE_BY_MEDICAID_PROVIDER_KEY: Readonly<Record<string, MedicaidStateCode>> = {
  AA201021: "AL",
  AA201024: "AR",
  AA201025: "CA",
  AA201026: "CO",
  AA201027: "CT",
  AA201028: "DC",
  AA201029: "DE",
  AA201030: "FL",
  AA201031: "GA",
  AA201036: "IA",
  AA201033: "ID",
  AA201034: "IL",
  AA201035: "IN",
  AA201037: "KS",
  AA201038: "KY",
  AA201039: "LA",
  AA201042: "MA",
  AA201041: "MD",
  AA201040: "ME",
  AA201043: "MI",
  AA201044: "MN",
  AA201046: "MO",
  AA201045: "MS",
  AA201047: "MT",
  AA201054: "NC",
  AA201055: "ND",
  AA201048: "NE",
  AA201050: "NH",
  AA201051: "NJ",
  AA201052: "NM",
  AA201049: "NV",
  AA201053: "NY",
  AA201056: "OH",
  AA201057: "OK",
  AA201058: "OR",
  AA201059: "PA",
  AA201060: "RI",
  AA201061: "SC",
  AA201062: "SD",
  AA201063: "TN",
  AA201064: "TX",
  AA201066: "UT",
  AA201068: "VA",
  AA201067: "VT",
  AA201069: "WA",
  AA201071: "WI",
  AA201070: "WV",
  AA201072: "WY",
};

/** The states with no combination that accepts an SSN. Written by the generator from the
 *  table above, so it cannot fall out of step with AA's rules. Sending an SSN to these
 *  states is pure downside: extra protected data on the wire with no way to improve a match. */
export const SSN_NOT_ACCEPTED_STATES: readonly MedicaidStateCode[] = [
  "AR",
  "CA",
  "NE",
  "PA",
  "RI",
  "TN",
  "UT",
  "VT",
];
