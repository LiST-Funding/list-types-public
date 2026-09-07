/**
 * SNF-718 EHR registry types.
 *
 * A registry holds one preset per `srcType`: the `ehr_config` document and the
 * `ehr_settings` document for that system, side by side. Shapes are derived
 * from the live dev dumps of both collections (49 `ehr_config` docs /
 * 13 `ehr_settings` docs).
 *
 * A preset is client-agnostic. Every per-client field is an inert default the
 * consumer MUST override when applying a preset:
 * `ehr_config.config.snfAccountId`, `ehr_config.config.snfAccountName`,
 * `ehr_settings.isActive` and `ehr_settings.regions`.
 *
 * The preset data itself lives in the workflow server; this module is only the
 * shape contract.
 */
import type { EpicEhrConfig } from "./ehrConfigs";

/** Every srcType known to the system: the union of both collections. */
export type SrcType =
    "4NEXT"
  | "Aida"
  | "Aidin"
  | "AllScripts"
  | "EnsoCare"
  | "Epic Ascension"
  | "Epic Atlantic"
  | "Epic Boston Medical Center"
  | "Epic EMR Link"
  | "Epic Hackensack"
  | "Epic Hartford"
  | "Epic HealthEConnection"
  | "Epic Kettering"
  | "Epic Middlesex"
  | "Epic Mountainside"
  | "Epic OSU"
  | "Epic OhioHealth"
  | "Epic Piedmont"
  | "Epic Premier Health"
  | "Epic Princton"
  | "Epic RWJBH"
  | "Epic Rochester"
  | "Epic SSM"
  | "Epic Select"
  | "Epic Sentara"
  | "Epic Southcoast"
  | "Epic St. Elizabeth"
  | "Epic Tanner"
  | "Epic TriHealth"
  | "Epic Trinity CT"
  | "Epic UC Health"
  | "Epic UCCON"
  | "Epic UMMS"
  | "Epic UPMC"
  | "Epic UW Health"
  | "Epic Unity Point"
  | "Epic University Hospital"
  | "Epic Virtua"
  | "Epic WellStar"
  | "Epic Yale"
  | "Incoming Faxes"
  | "Lawrence General"
  | "Manual Referral"
  | "Milford Regional"
  | "Navi"
  | "Repisodic"
  | "Steward"
  | "eFax"
;

/**
 * Body of `ehr_config.config` as it appears across all 43 preset configs.
 *
 * Reuses {@link EpicEhrConfig} — the Epic-shaped fields (`reportType`,
 * `markAsUnReadId`, `responseIsFrom*`) are present on non-Epic systems too
 * (Aidin, 4NEXT, Repisodic ...), so the Epic interface is the accurate
 * superset. Only `requestType` is loosened: it is absent on 1 of the 43.
 */
export interface EhrConfigBody extends Omit<EpicEhrConfig, "requestType"> {
  /** absent on 1 of the 43 preset configs */
  requestType?: string;
}

/** An `ehr_config` document, minus `_id` and the encrypted `cred` subdoc. */
export interface EhrConfigPreset {
  /** `ehr_config.name`; half of the unique index with `config.snfAccountId` */
  name: string;
  env: string;
  /** written to the literal DB key "Dispaly name" (the typo is in the schema) */
  displayName: string;
  config: EhrConfigBody;
}

/**
 * `ehr_settings.settings`.
 *
 * `referralResponse` is deliberately untyped: `selectOptions` has three
 * mutually incompatible shapes across the 8 systems that define it
 * (status-transition map, id/label lists, value-option map). It is absent on
 * the other 40, whose `settings` is `{}`.
 */
export interface EhrSettingsBody {
  referralResponse?: object;
}

/**
 * An `ehr_settings` document, minus `_id` and
 * `settings.referralResponse.facilitiesExecutingUsers` (a facility-name to
 * user-`_id` map, per client, never part of a preset).
 *
 * Only 13 srcTypes have a doc in `ehr_settings`; a registry synthesizes an
 * empty one for the other 35 so every srcType has both documents.
 */
export interface EhrSettingsPreset {
  /** `ehr_settings.name`, equal to the srcType */
  name: string;
  /**
   * Defines whether this srcType is enabled for the client. Always `false` in a
   * preset; the consumer turns it on once the system is configured.
   */
  isActive: boolean;
  /** per-client; always `[]` in a preset, set by the consumer */
  regions: number[];
  /** `{}` on the 40 systems with no referral-response support */
  settings: EhrSettingsBody;
}

/** Both documents for one srcType. `ehr_config` is null for a non-scraped system. */
export interface EhrPreset {
  srcType: SrcType;
  /** display name, taken from whichever document defines one */
  displayName: string;
  ehr_config: EhrConfigPreset | null;
  ehr_settings: EhrSettingsPreset;
}

export type EhrPresetRegistry = Record<SrcType, EhrPreset>;
