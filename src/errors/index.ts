/**
 * Error category taxonomy — single source of truth shared across
 * NaviHealth (scrapers), WorkflowServer (API), and LogsCenter (dashboard).
 *
 * Every error that reaches the support dashboard should map to ONE category.
 * The category carries: a plain-language meaning, a default severity, and who
 * is expected to act. This is what turns ~200 raw/library error strings into
 * something a non-engineer support person can understand and route.
 *
 * The `message` is PHI/PII-free by contract — no patient names, MRNs,
 * DOBs, or free-text clinical detail. Technical specifics belong in the log's
 * `data`/`stack`, not here.
 *
 * Phase 0 deliverable: the taxonomy only. Mapping individual raw errors to a
 * category (the classifier) lands in a later phase; see
 * docs/Architecture/Error Catalog.md for the message→category mapping.
 */

/** Aligns with the dashboard log `type` field. */
export type ErrorSeverity = "info" | "warning" | "error" | "critical";

/** Who is expected to act on this category. */
export type ErrorAudience = "support" | "engineering" | "ops" | "none";

export enum ErrorCategory {
  // ---- EHR automation (NaviHealth scrapers) -----------------------------
  /** Portal slow/down/unreachable, navigation/network timeouts. */
  EHR_UNREACHABLE = "EHR_UNREACHABLE",
  /** The EHR site changed; selectors/frames/buttons no longer match. */
  EHR_LAYOUT_CHANGED = "EHR_LAYOUT_CHANGED",
  /** Couldn't sign in — bad/expired credentials or changed login flow. */
  EHR_LOGIN_FAILED = "EHR_LOGIN_FAILED",
  /** A privacy prompt ("Break the Glass") blocked automatic access. */
  EHR_PRIVACY_GATE = "EHR_PRIVACY_GATE",
  /** Couldn't fill/submit the referral response back into the EHR. */
  RESPONSE_SUBMIT_FAILED = "RESPONSE_SUBMIT_FAILED",

  // ---- Data -------------------------------------------------------------
  /** Expected data missing or in an unexpected shape (parse/null/undefined). */
  DATA_INCOMPLETE = "DATA_INCOMPLETE",

  // ---- Platform / config ------------------------------------------------
  /** A facility, account, key, or env var is missing or misconfigured. */
  CONFIG_MISSING = "CONFIG_MISSING",
  /** Collected the data but couldn't save it to the platform/backend. */
  UPLOAD_FAILED = "UPLOAD_FAILED",
  /** NOT a real error — an intentional dev/prod safety stop. */
  SAFETY_GUARD = "SAFETY_GUARD",

  // ---- API (WorkflowServer) ---------------------------------------------
  /** Authentication/authorization problem (session, API key, region). */
  AUTH = "AUTH",
  /** Missing or invalid request input. */
  VALIDATION = "VALIDATION",
  /** Requested item not found (removed or not yet synced). */
  NOT_FOUND = "NOT_FOUND",
  /** Conflicts with existing state (e.g. duplicate name). */
  CONFLICT = "CONFLICT",
  /** A dependent service failed (email, PDF, push, external API). */
  UPSTREAM_FAILED = "UPSTREAM_FAILED",

  // ---- Catch-all --------------------------------------------------------
  /** Unexpected/uncaught failure — a real bug needing engineering. */
  INTERNAL_BUG = "INTERNAL_BUG",
}

export interface ErrorCategoryMeta {
  /** Short human title for the category. */
  title: string;
  /** Default severity bucket (overridable per log site). */
  severity: ErrorSeverity;
  /** Who is expected to act. */
  audience: ErrorAudience;
  /** Plain-language, PHI-free line shown to support. */
  message: string;
  /** Longer explanation for the catalog / tooltips. */
  description: string;
}

export const ERROR_CATEGORIES: Record<ErrorCategory, ErrorCategoryMeta> = {
  [ErrorCategory.EHR_UNREACHABLE]: {
    title: "EHR portal unreachable",
    severity: "error",
    audience: "support",
    message:
      "The EHR portal didn't respond in time — it was likely slow or temporarily unavailable. This usually retries on its own.",
    description:
      "Navigation/network timeouts and connection errors while loading an EHR portal (Puppeteer navigation timeout, net::ERR_*, target closed). Often transient; if many fire at once it indicates a portal outage worth escalating.",
  },
  [ErrorCategory.EHR_LAYOUT_CHANGED]: {
    title: "EHR page layout changed",
    severity: "error",
    audience: "engineering",
    message:
      "A page on the EHR site changed and our automation couldn't find what it expected. Engineering needs to update it.",
    description:
      "Selector / frame / button / element not found, or an element detached from the page. Almost always means the hospital changed their site and the scraper's selectors are stale.",
  },
  [ErrorCategory.EHR_LOGIN_FAILED]: {
    title: "EHR login failed",
    severity: "error",
    audience: "support",
    message:
      "Couldn't sign in to the EHR — the saved credentials may be wrong or expired, or the login screen changed.",
    description:
      "Login failures, missing/invalid credentials, 2FA prompts, or being redirected back to the login page. Support can re-check the saved credentials for the facility first.",
  },
  [ErrorCategory.EHR_PRIVACY_GATE]: {
    title: "EHR privacy gate",
    severity: "warning",
    audience: "support",
    message:
      "The EHR showed a privacy prompt ('Break the Glass') that blocked automatic access; it may need manual approval.",
    description:
      "The EHR raised a privacy/consent interstitial the automation couldn't clear. May require a person to approve access in the EHR.",
  },
  [ErrorCategory.RESPONSE_SUBMIT_FAILED]: {
    title: "Referral response submit failed",
    severity: "error",
    audience: "support",
    message:
      "Couldn't fill or submit the referral response back into the EHR. The response form or facility setup may need checking.",
    description:
      "Filling/submitting a referral response failed (field not found, option not selectable, submit button missing, executing user not configured). Check the facility's referral-response configuration.",
  },
  [ErrorCategory.DATA_INCOMPLETE]: {
    title: "Data incomplete or unexpected",
    severity: "error",
    audience: "engineering",
    message:
      "Expected information for this referral was missing or in an unexpected format, so processing stopped.",
    description:
      "Missing required fields (MRN, admission date), patient/referral not found in the source, JSON parse failures, or null/undefined dereferences. Verify the referral is complete in the source system; often needs an engineering look.",
  },
  [ErrorCategory.CONFIG_MISSING]: {
    title: "Configuration missing",
    severity: "error",
    audience: "ops",
    message: "A facility, account, or key is missing or misconfigured, so this couldn't run.",
    description:
      "Required configuration absent or invalid (SNF account id/name, auth keys, facility id, feature flags). Fix the configuration for that facility/environment.",
  },
  [ErrorCategory.UPLOAD_FAILED]: {
    title: "Save to platform failed",
    severity: "error",
    audience: "engineering",
    message:
      "We collected the data but couldn't save it to the platform — usually a temporary backend or network issue.",
    description:
      "Non-2xx response from the WorkflowServer API, failed log POST, or invalid file on upload. Data is typically retained locally; often transient.",
  },
  [ErrorCategory.SAFETY_GUARD]: {
    title: "Safety guard (not an error)",
    severity: "info",
    audience: "none",
    message:
      "Not an error — an intentional safety stop (e.g. response submission disabled in this environment).",
    description:
      "Deliberate guards such as refusing to submit referral responses in dev, or when a feature flag is off. These are currently logged at high severity and should be downgraded to info so they stop appearing as alerts.",
  },
  [ErrorCategory.AUTH]: {
    title: "Not authorized",
    severity: "warning",
    audience: "support",
    message: "The request wasn't authorized — a sign-in, API key, or region-permission issue.",
    description:
      "Missing/invalid Authorization header or API key, unauthenticated request, or a user lacking access to a region/facility (HTTP 401/403).",
  },
  [ErrorCategory.VALIDATION]: {
    title: "Invalid request",
    severity: "warning",
    audience: "support",
    message: "The request was missing required information or had invalid values.",
    description: "Client input failed validation — missing required fields, wrong types, out-of-range values (HTTP 400).",
  },
  [ErrorCategory.NOT_FOUND]: {
    title: "Not found",
    severity: "warning",
    audience: "support",
    message: "The requested item couldn't be found — it may have been removed or not yet synced.",
    description: "A referral, patient, facility, label, or config record referenced by id does not exist (HTTP 404).",
  },
  [ErrorCategory.CONFLICT]: {
    title: "Conflict with existing data",
    severity: "warning",
    audience: "support",
    message: "This conflicts with something that already exists (for example, a duplicate name).",
    description: "Unique-constraint or state conflicts — duplicate names, already-existing records (HTTP 409, E11000).",
  },
  [ErrorCategory.UPSTREAM_FAILED]: {
    title: "Dependent service failed",
    severity: "error",
    audience: "engineering",
    message: "A service we depend on (email, PDF, notifications, or an external API) failed.",
    description:
      "Failure calling a downstream dependency — SendGrid/email, PDF generation, FCM push, NLP/OCR processing, or another external integration.",
  },
  [ErrorCategory.INTERNAL_BUG]: {
    title: "Unexpected internal error",
    severity: "error",
    audience: "engineering",
    message:
      "An unexpected error occurred — this is a bug for engineering. Please share the referral id when escalating.",
    description:
      "Generic catch-all 500s, uncaught exceptions, 'failed all attempts', and other unclassified failures. Should shrink over time as specific categories are added.",
  },
};

/** Convenience accessor. */
export function categoryMeta(code: ErrorCategory): ErrorCategoryMeta {
  return ERROR_CATEGORIES[code];
}

/**
 * A categorized error *instance* — what you produce when an error is tagged.
 *
 * The `code` supplies the friendly, PHI-free `message`/severity/audience (from
 * the catalog); `reason` keeps the ORIGINAL error text verbatim so engineers
 * never lose it. Friendly message and original reason coexist — the friendly
 * one is the headline, the reason sits underneath. Never overwrite the original.
 */
export interface CategorizedError {
  /** Which category this maps to. */
  code: ErrorCategory;
  /** Original error message, verbatim — e.g. "Navigation timeout of 30000 ms exceeded". */
  reason?: string;
  /** Structured, PHI-free technical context for drill-down. */
  detail?: Record<string, unknown>;
}

/** What the dashboard renders: the catalog meta + the original reason/detail. */
export interface ResolvedError extends ErrorCategoryMeta {
  code: ErrorCategory;
  /** Original error message, verbatim — shown under the friendly `message`. */
  reason?: string;
  detail?: Record<string, unknown>;
}

/**
 * Resolve a categorized error into the full view: the catalog's friendly
 * `message` (headline) plus the original `reason` (technical line underneath).
 */
export function describeError(err: CategorizedError): ResolvedError {
  return { code: err.code, ...ERROR_CATEGORIES[err.code], reason: err.reason, detail: err.detail };
}
