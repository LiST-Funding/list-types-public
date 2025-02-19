export interface PCCDetails {
    loginUser?: string;
    loginPassword?: string;
    loginName?: string;
    loginId?: string;
    fac_id?: string;
    fac_name?: string;
    referalId?: string;
    prefix?: string;
    firstName?: string;
    surname?: string;
    suffix?: string;
    preferredName?: string;
    medicareBenificiaryId?: string;
    SocialSecurity?: string;
    ssnRequired?: boolean;
    medicare?: string;
    medicaid?: string;
    medicareCoverage?: string;
    vaccine?: string;
    birthDate?: string;
    mostRecentAdmission?: string | Date;
    primaryLanguage?: number;
    defaultPharmacy?: number;
    alergies?: string;
    allergiesBoolean?: boolean;
    gender?: string;
    files?: string;
    concentVaccine?: string;
    concentPneumonia?: string;
    race?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    county?: string;
    country?: string;
    homePhone?: string;
    email?: string;
    provState?: string;

    error?: {
        msgs: [],
        isCritical: false
    }
    status?:  {

    }
}

