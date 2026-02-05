export type UserEhrSettings  =  {
    _id?: string;

    /** the user _id of the user this settings belongs to (if exists) */
    userId?:string;
    
    /** the user's list display name */
    displayName: string;

    /** the user's role number */
  /**map of the user's ehr display names by srcType.
   * this is used to unified user data across ehrs.
   * example:
   * {
   *   "AllScripts": "John, D.",
   *   "Epic WellStar": "John Doe",
   *   "Navi": "Doe John",
   *   "Aidin": "Doe, John"
   * }
  */
  ehrDisplayName?: { [srcType: string]: string }
}