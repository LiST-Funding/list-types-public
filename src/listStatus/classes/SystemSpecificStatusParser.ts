import { ListStatus, ListStatusType, StatusesMap } from "../listStatus"



export class SystemSpecificStatusParser{
    #ehrStatuses:StatusesMap ;
    #hospitalStatuses: StatusesMap;

    constructor(
        ehrStatuses: StatusesMap,
        hospitalStatuses:StatusesMap
    ){
        this.#ehrStatuses = ehrStatuses;
        this.#hospitalStatuses = hospitalStatuses;
    }


    parseEhrStatusToListStatus(status:string) {
        for(const [listStatus, values] of Object.entries(this.#ehrStatuses)) {
            if(values.includes(status)) {
                return listStatus;
            }
        }
        }
        
    parseHospitalStatusToListStatus(status:string) {
        for(const [listStatus, values] of Object.entries(this.#hospitalStatuses)) {
            if(values.includes(status)) {
                return listStatus;
            }
        }
        }
        
        
    parseStatusToListStatus(status:string) {
            if(!status) {
                return ListStatus.New;
            }
            return this.parseEhrStatusToListStatus(status) || this.parseHospitalStatusToListStatus(status) || status;
        }
    
}