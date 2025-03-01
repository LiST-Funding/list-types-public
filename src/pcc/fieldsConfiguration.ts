import { PCCDetails } from './pccDetails';

export function getPccFieldsAndOptions(allFields: any[], options: any[]): PCCField[] {
    allFields.forEach((field: any) => {
        if (field.type === 'select') {
            field.options = options.filter(option => option.select === field.listName && (option.facility === '' || option.facility === field.facility));
        }
    });

    return allFields as PCCField[];

}
export function getPccFieldsAndOptionsByFacility(details: PCCDetails, allFields: any[], options: any[]): PCCField[] {
    // explanantion how it work
    // field can be for all facilities or for specific facility.
    // if facility is empty, then it is for all facilities.
    // if facility is not empty, then it is for specific facility.
    // if there is two fields with same names, just one of them can be empty. the other is specific facility. choose only one.
    // if field is select, then it has options.
    // options can be for all facilities or for specific facility.
    // if option facility is empty, then it is for all facilities.
    // if option facility is not empty, then it is for specific facility.
    // if option is default, then it is default option.

    const uniqueFields: any = {};

    allFields.forEach(field => {
        if (!uniqueFields[field.listName] || ( details.fac_id == field.facility)) {
            uniqueFields[field.listName] = field;
        }
    });

    // if not fac_id in details then return all fields
    // if fac_id in details then return only fields with empty facility or with same facility
    const fields = Object.values(uniqueFields).filter((field: any) => !details.fac_id || !field.facility || field.facility == details.fac_id);

    // NOte we are using == because fac_id can be undefined or 19 or "19"
    fields.forEach((field: any) => {
        if (field.type === 'select') {
            field.options = options.filter(option => option.select == field.listName && (! field.facility || option.facility == field.facility));
        }
    });

    return fields as PCCField[];

}


const pccDetails2: PCCDetails = {
    surname: 'Test',
    firstName: 'Test',
    suffix: undefined,
    prefix: '',
    birthDate: new Date('01/01/1970'),
    primaryLanguage: 9046,
    defaultPharmacy: 0,
    alergies: '',
    allergiesBoolean: false,
    gender: 'M',
}

// create interface for fields name PCCField
export interface PCCFieldOption {
    select: string;
    facility: string;
    listOption: string;
    listValue: string;
    optionValuePcc: string;
    isDefault: string;
}

export interface PCCField {
    listName: string;
    facility: string;
    hidden: string;
    DisplayLabel: string;
    label: string;
    required: string;
    DefaultValue: string;
    min: string;
    max: string;
    type: string;
    findBy: string;
    id: string;
    selector: string;
    selector2: string;
    group: string;
    order: string;
    options?: PCCFieldOption[];
}


