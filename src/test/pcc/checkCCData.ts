import { getPccFieldsAndOptionsByFacility } from "../../pcc"

const checkCCData = {
    "_id": {
      "$oid": "67eab35a5555be8c3251156d"
    },
    "options": [
      {
        "select": "gender",
        "facility": "",
        "listOption": "Male",
        "listValue": "M",
        "optionValuePcc": "M",
        "isDefault": "TRUE"
      },
      {
        "select": "gender",
        "facility": "",
        "listOption": "Female",
        "listValue": "F",
        "optionValuePcc": "F",
        "isDefault": ""
      },
      {
        "select": "gender",
        "facility": "",
        "listOption": "Unknown",
        "listValue": "U",
        "optionValuePcc": "U",
        "isDefault": ""
      },
      {
        "select": "primaryLanguage",
        "facility": "",
        "listOption": "Declined to Specify",
        "listValue": "9899",
        "optionValuePcc": "9899",
        "isDefault": ""
      },
      {
        "select": "primaryLanguage",
        "facility": "",
        "listOption": "English",
        "listValue": "9046",
        "optionValuePcc": "9046",
        "isDefault": "TRUE"
      },
      {
        "select": "primaryLanguage",
        "facility": "",
        "listOption": "Leave Blank",
        "listValue": "0",
        "optionValuePcc": "0",
        "isDefault": ""
      },
      {
        "select": "primaryLanguage",
        "facility": "",
        "listOption": "Spanish",
        "listValue": "39628",
        "optionValuePcc": "39628",
        "isDefault": ""
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Dr.",
        "listValue": "1056",
        "optionValuePcc": "1056",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Father",
        "listValue": "11400",
        "optionValuePcc": "11400",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Fr.",
        "listValue": "9908",
        "optionValuePcc": "9908",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Miss",
        "listValue": "1057",
        "optionValuePcc": "1057",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Mr.",
        "listValue": "1049",
        "optionValuePcc": "1049",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Mrs.",
        "listValue": "1050",
        "optionValuePcc": "1050",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Ms.",
        "listValue": "1055",
        "optionValuePcc": "1055",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Pastor",
        "listValue": "11402",
        "optionValuePcc": "11402",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Rev.",
        "listValue": "11401",
        "optionValuePcc": "11401",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Sister",
        "listValue": "11403",
        "optionValuePcc": "11403",
        "isDefault": "FALSE"
      },
      {
        "select": "prefix",
        "facility": "",
        "listOption": "Sr.",
        "listValue": "19684",
        "optionValuePcc": "19684",
        "isDefault": "FALSE"
      },
      {
        "select": "suffix",
        "facility": "",
        "listOption": "III",
        "listValue": "14043",
        "optionValuePcc": "14043",
        "isDefault": ""
      },
      {
        "select": "suffix",
        "facility": "",
        "listOption": "Jr",
        "listValue": "7000",
        "optionValuePcc": "7000",
        "isDefault": ""
      },
      {
        "select": "suffix",
        "facility": "",
        "listOption": "Sr",
        "listValue": "7001",
        "optionValuePcc": "7001",
        "isDefault": ""
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "",
        "listValue": "",
        "optionValuePcc": "",
        "isDefault": "FALSE"
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "HMO/Managed Care",
        "listValue": "HMO/Managed Care",
        "optionValuePcc": "HMO/Managed Care",
        "isDefault": "FALSE"
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "No coverage",
        "listValue": "No coverage",
        "optionValuePcc": "No coverage",
        "isDefault": "FALSE"
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "Part A & B",
        "listValue": "Part A & B",
        "optionValuePcc": "Part A & B",
        "isDefault": "FALSE"
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "Part A & D",
        "listValue": "Part A & D",
        "optionValuePcc": "Part A & D",
        "isDefault": "FALSE"
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "Part A only",
        "listValue": "Part A only",
        "optionValuePcc": "Part A only",
        "isDefault": "FALSE"
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "Part A, B & D",
        "listValue": "Part A, B & D",
        "optionValuePcc": "Part A, B & D",
        "isDefault": "FALSE"
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "Part B only",
        "listValue": "Part B only",
        "optionValuePcc": "Part B only",
        "isDefault": "FALSE"
      },
      {
        "select": "medicareCoverage",
        "facility": "",
        "listOption": "Part D",
        "listValue": "Part D",
        "optionValuePcc": "Part D",
        "isDefault": "FALSE"
      }
    ],
    "pccFields": [
      {
        "listName": "residentNumber",
        "hidden": "TRUE",
        "DisplayLabel": "Resident Number",
        "label": "Resident Number",
        "required": "TRUE",
        "type": "input",
        "findBy": "selector",
        "selector": "\"input[name=\"\"\"\"client_id_number\"\"\"\"]\"",
        "max": ""
      },
      {
        "listName": "medicalRecord",
        "hidden": "TRUE",
        "DisplayLabel": "Medical Record",
        "label": "Medical Record",
        "required": "",
        "type": "input",
        "findBy": "label",
        "max": ""
      },
      {
        "listName": "header",
        "hidden": "TRUE",
        "DisplayLabel": "Header",
        "label": "Header",
        "required": "TRUE",
        "findBy": "id",
        "id": "#pageHeader",
        "max": ""
      },
      {
        "listName": "surname",
        "DisplayLabel": "Last Name",
        "label": "Last Name",
        "required": "TRUE",
        "type": "input",
        "findBy": "selector",
        "selector": "\"input[name=\"\"\"\"last_name\"\"\"\"]\"",
        "group": "1",
        "order": "3",
        "max": ""
      },
      {
        "listName": "title",
        "hidden": "TRUE",
        "DisplayLabel": "title",
        "label": "title",
        "required": "TRUE",
        "type": "select",
        "findBy": "selector",
        "selector": "\"select[name=\"\"\"\"title\"\"\"\"]\"",
        "max": ""
      },
      {
        "listName": "firstName",
        "DisplayLabel": "First Name",
        "label": "First Name",
        "required": "TRUE",
        "type": "input",
        "findBy": "selector",
        "selector": "\"input[name=\"\"\"\"first_name\"\"\"\"]\"",
        "group": "1",
        "order": "2",
        "max": ""
      },
      {
        "listName": "suffix",
        "facility": "",
        "DisplayLabel": "Suffix",
        "label": "Suffix",
        "required": "",
        "type": "select",
        "findBy": "selector",
        "selector": "\"select[name=\"\"\"\"suffix\"\"\"\"]\"",
        "group": "1",
        "order": "4",
        "max": ""
      },
      {
        "listName": "prefix",
        "facility": "",
        "DisplayLabel": "Prefix",
        "type": "select",
        "group": "1",
        "order": "1",
        "max": ""
      },
      {
        "listName": "preferredName",
        "DisplayLabel": "Preferred Name",
        "label": "Preferred Name",
        "required": "",
        "type": "input",
        "findBy": "selector",
        "selector": "\"input[name=\"\"\"\"nickname\"\"\"\"]\"",
        "group": "1",
        "order": "5",
        "max": ""
      },
      {
        "listName": "birthDate",
        "DisplayLabel": "Birth Date",
        "type": "date",
        "group": "1",
        "order": "7",
        "max": ""
      },
      {
        "listName": "mostRecentAdmission",
        "hidden": "TRUE",
        "type": "date",
        "max": ""
      },
      {
        "listName": "primaryLanguage",
        "DisplayLabel": "Primary Language",
        "type": "select",
        "group": "1",
        "order": "10",
        "max": "",
        "hidden": "TRUE"
      },
      {
        "listName": "defaultPharmacy",
        "hidden": "TRUE",
        "type": "input",
        "max": ""
      },
      {
        "listName": "alergies",
        "hidden": "TRUE",
        "type": "input",
        "max": ""
      },
      {
        "listName": "allergiesBoolean",
        "hidden": "TRUE",
        "type": "input",
        "max": ""
      },
      {
        "listName": "gender",
        "DisplayLabel": "Sex",
        "type": "select",
        "label": "Sex",
        "order": "8",
        "group": "1",
        "max": ""
      },
      {
        "DisplayLabel": "Medicare Coverage",
        "label": "Medicare Coverage",
        "listName": "medicareCoverage",
        "facility": "",
        "group": "2",
        "order": "4",
        "max": "",
        "required": "",
        "type": "select"
      },
      {
        "listName": "medicare",
        "DisplayLabel": "Medicare #",
        "type": "input",
        "selector": "\"input[aria-labelledby=\"\"\"\"Medicare_(HIC)_#-AriaId\"\"\"\"]\"",
        "group": "2",
        "order": "2",
        "max": "11"
      },
      {
        "listName": "medicaid",
        "DisplayLabel": "Medicaid #",
        "type": "input",
        "selector": "\"input[aria-labelledby=\"\"\"\"Managed_Medicaid-AriaId\"\"\"\"]\"",
        "selector2": "\"input[aria-labelledby=\"\"Medicaid_#-AriaId\"\"]\"",
        "group": "2",
        "order": "3",
        "max": "15"
      },
      {
        "listName": "medicareSSN",
        "hidden": "TRUE",
        "type": "input",
        "selector": "\"input[aria-labelledby=\"\"\"\"Social_Security_#-AriaId\"\"\"\"]\"",
        "max": ""
      },
      {
        "listName": "medicareBenificiaryId",
        "DisplayLabel": "Medicare Beneficiary ID",
        "type": "input",
        "selector": "\"input[aria-labelledby=\"\"\"\"Medicare_Beneficiary_ID-AriaId\"\"\"\"]\"",
        "group": "2",
        "order": "1",
        "max": "14"
      },
      {
        "listName": "address",
        "DisplayLabel": "Previous address",
        "group": "1",
        "order": "16",
        "max": "35"
      },
      {
        "listName": "zipCode",
        "DisplayLabel": "Postal/Zip Code",
        "group": "1",
        "order": "17",
        "max": ""
      },
      {
        "listName": "city",
        "DisplayLabel": "City",
        "group": "1",
        "order": "18",
        "max": ""
      },
      {
        "listName": "county",
        "DisplayLabel": "County",
        "group": "1",
        "order": "19",
        "max": ""
      },
      {
        "listName": "country",
        "DisplayLabel": "Country",
        "group": "1",
        "hidden": "TRUE",
        "order": "20",
        "max": ""
      },
      {
        "listName": "homePhone",
        "DisplayLabel": "Phone number",
        "group": "1",
        "order": "22",
        "max": ""
      },
      {
        "listName": "email",
        "group": "",
        "order": "",
        "hidden": "TRUE",
        "max": ""
      },
      {
        "listName": "provState",
        "DisplayLabel": "Prov/State",
        "group": "1",
        "order": "21",
        "max": ""
      },
      {
        "listName": "insuranceName",
        "DisplayLabel": "Insurance name",
        "group": "2",
        "max": "25",
        "hidden": "TRUE"
      },
      {
        "listName": "insuranceNumber",
        "DisplayLabel": "Insurance Number",
        "group": "2",
        "max": "15",
        "hidden": "TRUE"
      },
      {
        "DisplayLabel": "Social Security #",
        "listName": "SocialSecurity",
        "label": "Social Security",
        "type": "input",
        "order": "6",
        "group": "1",
        "max": ""
      },
      {
        "DisplayLabel": "SSN Required",
        "listName": "ssnRequired",
        "label": "SSN Required",
        "type": "checkbox",
        "order": "6.1",
        "group": "1",
        "max": ""
      },
      {
        "label": "Managed Medicare:",
        "required": "",
        "listName": "managedMedicareName",
        "hidden": "",
        "DisplayLabel": "Managed Medicare Name",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Managed_Medicare-AriaId\"]",
        "facility": ""
      },
      {
        "label": "Managed Medicare #:",
        "required": "",
        "listName": "managedMedicareNumber",
        "hidden": "",
        "DisplayLabel": "Managed Medicare Number",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Managed_Medicare#-AriaId\"]",
        "facility": ""
      },
      {
        "label": "Managed Medicaid:",
        "required": "",
        "listName": "managedMedicaidName",
        "hidden": "",
        "DisplayLabel": "Managed Medicaid Name",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Managed_Medicaid-AriaId\"]",
        "facility": ""
      },
      {
        "label": "Managed Medicaid #:",
        "required": "",
        "listName": "managedMedicaidNumber",
        "hidden": "",
        "DisplayLabel": "Managed Medicaid Number",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Managed_Medicaid#-AriaId\"]",
        "facility": ""
      },
      {
        "label": "Managed Medicaid #:",
        "required": "",
        "listName": "managedMedicaidNumber",
        "hidden": "TRUE",
        "DisplayLabel": "Managed Medicaid Number",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Managed_Medicaid#-AriaId\"]",
        "facility": "296"
      },
      {
        "label": "Managed Medicaid #:",
        "required": "",
        "listName": "managedMedicaidNumber",
        "hidden": "TRUE",
        "DisplayLabel": "Managed Medicaid Number",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Managed_Medicaid#-AriaId\"]",
        "facility": "297"
      },
      {
        "label": "Secondary Insurance:",
        "required": "",
        "listName": "secondaryInsuranceName",
        "hidden": "",
        "DisplayLabel": "Secondary Insurance Name",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Secondary_Insurance-AriaId\"]",
        "facility": ""
      },
      {
        "label": "Secondary Ins Policy #:",
        "required": "",
        "listName": "secondaryInsuranceNumber",
        "hidden": "",
        "DisplayLabel": "Secondary Ins Policy #",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Secondary_Ins_Policy_#-AriaId\"]",
        "facility": ""
      },
      {
        "label": "Commercial Insurance Name:",
        "required": "",
        "listName": "commercialInsuranceName",
        "hidden": "",
        "DisplayLabel": "Commercial Insurance Name",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Commercial_Insurance_Name:-AriaId\"]",
        "facility": "295"
      },
      {
        "label": "Commercial Insurance Policy #",
        "required": "",
        "listName": "commercialInsuranceNumber",
        "hidden": "",
        "DisplayLabel": "Commercial Insurance Policy #",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"Commercial_Insurance_Policy_#:-AriaId\"]",
        "facility": "295"
      },
      {
        "label": "Email:",
        "required": "",
        "listName": "email",
        "hidden": "",
        "DisplayLabel": "Email",
        "type": "input",
        "max": 30,
        "findBy": "selector",
        "selector": "input[aria-labelledby=\"email_address-AriaId\"]",
        "facility": ""
      },
      {
        "label": "PASARR#:",
        "required": "",
        "listName": "passar",
        "hidden": "",
        "DisplayLabel": "PASARR#",
        "type": "input",
        "max": 30,
        "findBy": "nextInput",
        "selector": "input[aria-labelledby=\"PASARR#-AriaId\"]",
        "facility": ""
      },
      {
        "label": "PASARR Date:",
        "required": "",
        "listName": "pasarrDate",
        "hidden": "",
        "DisplayLabel": "PASARR Date",
        "type": "date",
        "max": 30,
        "findBy": "prefix",
        "attr": "id",
        "selector": "uclientids_date",
        "facility": ""
      }
    ],
    "type": "push"
  }

  getPccFieldsAndOptionsByFacility({fac_id: 296, fac_name: ''}, checkCCData.pccFields, checkCCData.options);