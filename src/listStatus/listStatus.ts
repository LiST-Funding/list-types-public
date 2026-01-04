
export const ListStatus =Object.freeze( {
    Accepted: 'accepted',
    Received: 'received',
    Interested: 'interested',
    Declined: 'declined',
    NoResponse: 'no-response',
    Selected: 'selected',
    NotSelected: 'not-selected',
    Cancelled: 'cancelled',
    Closed: 'closed',
    New: 'new',
    Admitted: 'admitted',
    ReAdmitted: 're-admitted',
  })
  export type ListStatusType = typeof ListStatus[keyof typeof ListStatus];
  export type StatusesMap = Partial<Record<ListStatusType,string[]>>

  export   const STATUS_ORDER:Record<ListStatusType,number> = {
    [ListStatus.Admitted]: -2,
    [ListStatus.ReAdmitted]: -1,
    [ListStatus.Selected]: 1,
    [ListStatus.NotSelected]: 2,
    [ListStatus.Cancelled]: 3,
    [ListStatus.Closed]:3,
    [ListStatus.Accepted]: 4,
    [ListStatus.Declined]: 4,
    [ListStatus.Interested]: 5,
    [ListStatus.Received]: 6,
    [ListStatus.New]: 7,
    [ListStatus.NoResponse]: 8,
  }

