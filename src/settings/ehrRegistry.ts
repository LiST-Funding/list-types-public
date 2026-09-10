/**
 * SNF-718 EHR registry types.
 *
 * A registry holds one preset per `srcType`: the `ehr_config` document and the
 * `ehr_settings` document for that system, side by side. Shapes are derived
 * from the live dev dumps of both collections (49 `ehr_config` docs /
 * 13 `ehr_settings` docs) plus the two referral-response `ehr_config` docs.
 *
 * A preset is client-agnostic. Every per-client field is an inert default the
 * consumer MUST override when applying a preset:
 * `ehr_config.config.snfAccountId`, `ehr_config.config.snfAccountName`,
 * `ehr_settings.isActive` and `ehr_settings.regions`.
 *
 * The preset data itself lives in the workflow server; this module is only the
 * shape contract.
 */
import type { BaseEhrConfig, EpicEhrConfig } from "./ehrConfigs";
import type { ExecutingAccountMode } from "../tasks/referralResponse/constants";

/**
 * Every srcType the registry knows.
 *
 * The first 48 are the union of the two collections. `"Aidin Response"` and
 * `"EnsoCare Response"` are registry-only keys for the referral-response
 * processes: their `ehr_config` docs carry the PARENT system's
 * `config.srcType` (`"Aidin"` / `"EnsoCare"`), so they need a key of their own
 * to sit in the registry. See {@link ResponseEhrPreset.respondsFor}.
 */
export type SrcType =
    "4NEXT"
  | "Aida"
  | "Aidin"
  | "Aidin Response"
  | "AllScripts"
  | "EnsoCare"
  | "EnsoCare Response"
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
  | "Manual Referral"
  | "Lawrence General"
  | "Milford Regional"
  | "Steward"
  | "Navi"
  | "Repisodic"
  | "eFax"
;

/**
 * Body of `ehr_config.config` for a scraper config, as it appears across all 43
 * of them.
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

/**
 * Body of `ehr_config.config` for a referral-response process
 * (`aidinResponse`, `ensocareResponse`).
 *
 * A response config drives responding, not scraping, so it carries no
 * `shouldLoadMore`, and none of the Epic list-reading fields (`requestType`,
 * `markAsUnReadId`, `reportType`) that {@link EhrConfigBody} has. What it adds
 * is the account mode.
 */
export interface ResponseEhrConfigBody extends Omit<BaseEhrConfig, "shouldLoadMore"> {
  /**
   * How this process pulls tasks and which account executes them. `null` when
   * the document does not set it, which is the case for `aidinResponse`.
   */
  executingAccountMode: ExecutingAccountMode | null;
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

/** The same document for a referral-response process. */
export interface ResponseEhrConfigPreset extends Omit<EhrConfigPreset, "config"> {
  config: ResponseEhrConfigBody;
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
 * empty one for the other 35 so every scraped srcType has both documents.
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

interface EhrPresetBase {
  srcType: SrcType;
  displayName: string;
}

/** A scraped system: what a Puppeteer scraper worker runs against. */
export interface ScraperEhrPreset extends EhrPresetBase {
  kind: "scraper";
  /** null on the 5 systems that are not scraped (Manual Referral, faxes ...) */
  ehr_config: EhrConfigPreset | null;
  ehr_settings: EhrSettingsPreset;
}

/**
 * A referral-response process. Has no `ehr_settings` document of its own: the
 * response settings live on the parent srcType named by `respondsFor`.
 */
export interface ResponseEhrPreset extends EhrPresetBase {
  kind: "response";
  /** the scraped srcType this process responds for, and its `config.srcType` */
  respondsFor: SrcType;
  ehr_config: ResponseEhrConfigPreset;
  ehr_settings: null;
}

export type EhrPreset = ScraperEhrPreset | ResponseEhrPreset;

export type EhrPresetRegistry = Record<SrcType, EhrPreset>;
