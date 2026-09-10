/**
 * Approved Admissions' Medicaid search routes — the source of truth, maintained by hand.
 *
 * One entry per AA provider group, two routes each (owner decision 2026-09-09: every Medicaid
 * search is anchored on an identifier). `idRoute` is the shortest combination AA accepts that
 * names the Medicaid ID and not the SSN; `ssnRoute` the shortest that names the SSN and not the
 * Medicaid ID, or null for the eight programs with no SSN search (AR CA NE PA RI TN UT VT). On a
 * tie in length the route asking for a date of birth beats one asking for a name. Combinations
 * naming both identifiers, or neither (name + date of birth), are deliberately not carried.
 *
 * Derived from AA's SearchOptions export (RequiredFieldsRule / "Search combination" per
 * provider group; the full 171-combination copy we received is kept in the docs vault, SNF-598
 * page, "Routing table proposal"). When AA sends a new export, re-derive and edit this object
 * directly (and MedicaidProviderKey / MedicaidStateCode in types.ts if a program is added or
 * removed); `npm run build` type-checks them against each other.
 *
 * Canonical consumer import: `list-types-public/eligibility`. This is the module's ONLY export:
 * 49 provider groups, 48 state codes. Everything else — which state a key belongs to, which
 * route a request satisfies, labels — is derived from it in each consumer: NaviHealth
 * approvedAdmissions/v2/medicaidSearchRules.js and Workflow-Front
 * payer-eligibility/medicaid-search-rules.ts. Field order inside a route is AA's own; consumers
 * compare routes as sets. The Medicare provider group (AA201001, one combination: first + last
 * name, date of birth, Medicare number) is what we already send and is not listed.
 */
import type { MedicaidSearchRules } from "./types";

export const MEDICAID_SEARCH_RULES: MedicaidSearchRules = {
  AA201021: { state: "AL", name: "Alabama", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201024: { state: "AR", name: "Arkansas", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: null },
  AA201025: { state: "CA", name: "California", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: null },
  AA201026: { state: "CO", name: "Colorado", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201027: { state: "CT", name: "Connecticut", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: ["Ssn", "LastName", "FirstName", "BirthDate"] },
  AA201028: { state: "DC", name: "DC", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201029: { state: "DE", name: "Delaware", idRoute: ["MedicaidNumber"], ssnRoute: ["LastName", "Ssn", "BirthDate"] },
  AA201030: { state: "FL", name: "Florida", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201031: { state: "GA", name: "Georgia", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201033: { state: "ID", name: "Idaho", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201034: { state: "IL", name: "Illinois", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201035: { state: "IN", name: "Indiana", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn"] },
  AA201036: { state: "IA", name: "Iowa", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201037: { state: "KS", name: "Kansas", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201038: { state: "KY", name: "Kentucky", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "LastName", "FirstName"] },
  AA201039: { state: "LA", name: "Louisiana", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: ["BirthDate", "Ssn"] },
  AA201040: { state: "ME", name: "Maine", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn"] },
  AA201041: { state: "MD", name: "Maryland", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201042: { state: "MA", name: "Massachusetts", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201043: { state: "MI", name: "Michigan", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn"] },
  AA201044: { state: "MN", name: "Minnesota", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201045: { state: "MS", name: "Mississippi", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201046: { state: "MO", name: "Missouri", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "LastName", "FirstName"] },
  AA201047: { state: "MT", name: "Montana", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201048: { state: "NE", name: "Nebraska", idRoute: ["MedicaidNumber"], ssnRoute: null },
  AA201049: { state: "NV", name: "Nevada", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201050: { state: "NH", name: "New Hampshire", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "LastName", "FirstName", "BirthDate"] },
  AA201051: { state: "NJ", name: "New Jersey", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "LastName", "FirstName", "BirthDate"] },
  AA201052: { state: "NM", name: "New Mexico", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201053: { state: "NY", name: "New York", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "LastName", "FirstName", "BirthDate"] },
  AA201054: { state: "NC", name: "North Carolina", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201055: { state: "ND", name: "North Dakota", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201056: { state: "OH", name: "Ohio", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201057: { state: "OK", name: "Oklahoma", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: ["Ssn", "LastName", "FirstName"] },
  AA201058: { state: "OR", name: "Oregon", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201059: { state: "PA", name: "Pennsylvania", idRoute: ["MedicaidNumber", "BirthDate"], ssnRoute: null },
  AA201060: { state: "RI", name: "Rhode Island", idRoute: ["MedicaidNumber"], ssnRoute: null },
  AA201061: { state: "SC", name: "South Carolina", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201062: { state: "SD", name: "South Dakota", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201063: { state: "TN", name: "Tennessee", idRoute: ["MedicaidNumber"], ssnRoute: null },
  AA201064: { state: "TX", name: "Texas", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "LastName"] },
  AA201065: { state: null, name: "Texas LTC", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201066: { state: "UT", name: "Utah", idRoute: ["MedicaidNumber", "LastName", "FirstName", "BirthDate"], ssnRoute: null },
  AA201067: { state: "VT", name: "Vermont", idRoute: ["MedicaidNumber"], ssnRoute: null },
  AA201068: { state: "VA", name: "Virginia", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201069: { state: "WA", name: "Washington", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201070: { state: "WV", name: "West Virginia", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201071: { state: "WI", name: "Wisconsin", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
  AA201072: { state: "WY", name: "Wyoming", idRoute: ["MedicaidNumber"], ssnRoute: ["Ssn", "BirthDate"] },
};
