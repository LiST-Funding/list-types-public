import { ListStatus, StatusesMap } from "../listStatus"

// MorCare shows the facility status as "<status> (<reason>)" and the hospital status the same way.
// The scraper passes only the status part, before the reason, to the parser.

export const MORCARE_EHR_STATUS: StatusesMap = {
    [ListStatus.Accepted]: ["Accepted"],
    [ListStatus.Received]: [],
    [ListStatus.Interested]: [],
    [ListStatus.Declined]: ["Declined"],
    [ListStatus.New]: ["Open"],
}

// "Final Placement" is the facility the hospital chose: when one facility of a patient has it,
// every other facility of that patient has "Cancelled".
export const MORCARE_HOSPITAL_STATUS: StatusesMap = {
    [ListStatus.Selected]: ["Final Placement"],
    [ListStatus.NotSelected]: [],
    [ListStatus.Cancelled]: ["Cancelled"],
    [ListStatus.Closed]: [],
}

// Statuses found on MorCare
// facility: "Open", "Accepted", "Declined"
// hospital: "Final Placement", "Cancelled"
