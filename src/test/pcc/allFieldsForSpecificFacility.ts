import { getPccFieldsAndOptionsByFacility } from "../../pcc";
import basePccData from "../../pcc/basePccData";

function getAllFieldsAndOptions() {
    const base = basePccData;
    const allFields = getPccFieldsAndOptionsByFacility({fac_id: 19}, base.pccFields, base.options);
    console.log(allFields);
}

getAllFieldsAndOptions();