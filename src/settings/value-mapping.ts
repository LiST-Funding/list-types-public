/**
 * The value-mapping admin API's JSON contract (WorkflowServer
 * `/snfs/admin/value-mapping/:kind/mappings`). A mapping links a raw value an
 * EHR sends, per kind and srcType, to one internal target, or to none
 * (`target: null`, unmapped). Kind-agnostic: the meaning of a target id is the
 * kind's own. Ids are strings and dates are ISO strings.
 */

/** One raw value and the target it maps to. */
export interface ValueMappingResponse {
  id: string;
  /** The EHR system that sends this value (e.g. "Navi", "Epic"). */
  srcType: string;
  /** The raw value as the EHR first sent it. */
  sourceValue: string;
  /** The target's id, or null while unmapped. */
  target: string | null;
  updatedAt: string | null;
  updatedByName: string | null;
}

/** One value a raw value can map to; `data` carries the kind's extra columns. */
export interface MappingTargetResponse {
  id: string;
  label: string;
  data: Record<string, string | number | null>;
}

/** GET `/:kind/mappings`: the requester's targets, plus the unmapped values and those mapped to one of them. */
export interface ValueMappingPageResponse {
  kind: string;
  targets: MappingTargetResponse[];
  mappings: ValueMappingResponse[];
  /** True when more mappings exist than one read returns. */
  truncated: boolean;
}

/**
 * PATCH `/:kind/mappings/:id` body. `target` null unmaps. `expectedTarget` is
 * the target the page loaded; the write lands only while it is still stored
 * (otherwise 409 `stale-mapping`). Sending the stored target again re-runs
 * propagation only.
 */
export interface UpdateValueMappingBody {
  target: string | null;
  expectedTarget: string | null;
}

/** Whether the saved change reached the records that carry the raw value. */
export type PropagationOutcome =
  | { status: 'ok'; recordsUpdated: number }
  | { status: 'failed' };

export interface UpdateValueMappingResponse {
  mapping: ValueMappingResponse;
  propagation: PropagationOutcome;
}

/** The 409 body when the mapping changed since the page loaded. */
export interface StaleValueMappingResponse {
  error: string;
  reason: 'stale-mapping';
  storedTarget: string | null;
}
