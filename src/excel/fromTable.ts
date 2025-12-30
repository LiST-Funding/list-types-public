import { Workbook, Worksheet, Buffer as ExcelBuffer, Column } from 'exceljs';
import { ListCellParams, ExcelFileHeaderParams, ExcelFileParams, ExcelFileAlign } from './types';
// import { applyCellStyles, buildHeaderData } from './util';
import { DEFAULTS } from './constants';
import { ListTable } from './types';
import { applyCellStyles, buildHeaderData } from './utils';

export function docFromTable(table: ListTable, title: string) {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet(title);
    table.rows.map(row => {
        for (const cellKey in row) {
            const cell = row[cellKey];
            if (typeof cell === 'string') {
                row[cellKey] = { value: cell } as ListCellParams;
            }
            if (typeof cell === 'number') {
                row[cellKey] = { value: '' + cell, type: 'number' } as ListCellParams;
            }
            if (cell instanceof Date) {
                row[cellKey] = { value: cell.toISOString(), type: 'date' } as ListCellParams;
            }
        }
        return row;
    });
    addHeaders(sheet, Object.keys(table.headers).map(header => ({ index: table.headers[header].index, key: header, value: table.headers[header].label, width: table.headers[header].width, bgColor: 'blue', color: 'white' })));
    addRows(sheet, table.rows.map(row => Object.keys(row).map(cell => row[cell] as ListCellParams)));
    Object.keys(table.headers).forEach((header, index) => {
        if(table.headers[header].width) {
            sheet.getColumn(index + 1).width = pxToExcelWidth(table.headers[header].width ?? 150);
        } else {
            autoFitColumns(sheet.getColumn(index + 1), table.headers[header].label);
        }
    });
    return workbook.xlsx.writeBuffer();
}

function pxToExcelWidth(px: number): number {
    return (px - 5) / 7;
}

export function autoFitColumns(column: Column, text: string, minimalWidth = 10) {
    column.width = Math.max(text.length + 2, minimalWidth);
 }
  
  
function addHeaders(sheet: Worksheet, headers: ExcelFileHeaderParams[]): void {
  const { headersData, headerIndexes } = buildHeaderData(headers);
  sheet.columns = headersData;
  const headerRow = sheet.getRow(1);
  let lastParams = headers[0];
  headerRow.eachCell({ includeEmpty: true }, (cell, index) => {
    const colIndex = headerIndexes[index];
    const params = headers[colIndex] ?? lastParams;
    if (!params) {
      return;
    }
    applyCellStyles(cell, params);
    lastParams = params;
  });
  headerRow.height = DEFAULTS.ROW.HEIGHT;
}

function addRows(sheet: Worksheet, rows: ListCellParams[][]): void {
  rows.forEach(cells => {
    const rowData = cells.map(({ value }) => value);
    const row = sheet.addRow(rowData);
    row.eachCell((cell, colIndex) => {
      const params = cells[colIndex - 1];
      if (!params) {
        return;
      }
      applyCellStyles(cell, params);
    });
    row.height = DEFAULTS.ROW.HEIGHT;
  });
}

export function createDocument({
  title,
  headers,
  rows,
}: ExcelFileParams): Promise<ExcelBuffer> {
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet(title);
  addHeaders(sheet, headers);
  addRows(sheet, rows);
  return workbook.xlsx.writeBuffer();
}

// const tableData: ListTable = {
//     "headers": {
//         "facilityName": {
//             "label": "Facility",
//             "width": 150
//         },
//         "firstName": {
//             "label": "First Name"
//         },
//         "lastName": {
//             "label": "Last Name"
//         },
//         "admissionDate": {
//             "label": "Admission Date"
//         },
//         "revisionDate": {
//             "label": "Revision Date"
//         },
//         "startDate": {
//             "label": "Start Date"
//         },
//         "status": {
//             "label": "Status"
//         },
//         "medication": {
//             "label": "Medication",
//             "width": 150
//         },
//         "orderStatus": {
//             "label": "Order Status",
//             "width": 80
//         },
//         "orderRevisionDate": {
//             "label": "Order Revision Date",
//             "width": 150
//         },
//         "orderStartDate": {
//             "label": "Order Start Date"
//         },
//         "orderDescription": {
//             "label": "Order Description",
//             "width": 150
//         },
//         "carePlanStatus": {
//             "label": "Care Plan Status",
//             "width": 80
//         },
//         "carePlanDescription": {
//             "label": "Care Plan Description",
//             "width": 150
//         },
//         "carePlanRevisionDate": {
//             "label": "Care Plan Revision Date"
//         },
//         "carePlanCreatedAt": {
//             "label": "Care Plan Created At"
//         }
//     },
//     "rows": [
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Lois",
//             "lastName": "Bethea",
//             "admissionDate": "11/29/22",
//             "revisionDate": "10/15/25",
//             "startDate": "2/22/24",
//             "status": "Active",
//             "medication": "Eliquis Oral Tablet 5 MG",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "8/9/24",
//             "orderStartDate": "5/31/24",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Eliquis Anticoagulant therapy r/t: Disease Process ",
//             "carePlanRevisionDate": "10/3/24",
//             "carePlanCreatedAt": "10/3/24"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Christian",
//             "lastName": "Boroughs",
//             "admissionDate": "10/8/25",
//             "revisionDate": "10/14/25",
//             "startDate": "10/9/25",
//             "status": "Active",
//             "medication": "Enoxaparin Sodium Injection Solution Prefilled Syringe 30 MG/0.3ML",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "10/10/25",
//             "orderStartDate": "10/9/25",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center,
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy ",
//             "carePlanRevisionDate": "10/9/25",
//             "carePlanCreatedAt": "10/9/25"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Rita",
//             "lastName": "Ercoli",
//             "admissionDate": "9/23/25",
//             "revisionDate": "10/10/25",
//             "startDate": "9/25/25",
//             "status": "Active",
//             "medication": "Eliquis Oral Tablet 2.5 MG",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "9/24/25",
//             "orderStartDate": "9/24/25",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy r/t: A-Fib ",
//             "carePlanRevisionDate": "9/24/25",
//             "carePlanCreatedAt": "9/24/25"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Mary",
//             "lastName": "Finkelday",
//             "admissionDate": "12/9/24",
//             "revisionDate": "8/11/25",
//             "startDate": "12/9/24",
//             "status": "Active",
//             "medication": "Eliquis Oral Tablet 2.5 MG",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "12/10/24",
//             "orderStartDate": "12/10/24",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy (eliquis) r/t: A-Fib ",
//             "carePlanRevisionDate": "12/9/24",
//             "carePlanCreatedAt": "12/9/24"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Bonnie",
//             "lastName": "Fowler",
//             "admissionDate": "9/24/25",
//             "revisionDate": "10/17/25",
//             "startDate": "9/24/25",
//             "status": "Active",
//             "medication": "Apixaban Tablet 2.5 MG",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "9/24/25",
//             "orderStartDate": "9/24/25",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy r/t: A-Fib ",
//             "carePlanRevisionDate": "9/24/25",
//             "carePlanCreatedAt": "9/24/25"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Henry",
//             "lastName": "Gilbert",
//             "admissionDate": "8/29/25",
//             "revisionDate": "10/14/25",
//             "startDate": "8/30/25",
//             "status": "Active",
//             "medication": "Enoxaparin Sodium Injection Solution Prefilled Syringe 30 MG/0.3ML",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "9/1/25",
//             "orderStartDate": "9/1/25",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy r/t: Post Surgical ",
//             "carePlanRevisionDate": "9/1/25",
//             "carePlanCreatedAt": "9/1/25"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Jean",
//             "lastName": "Gochenaur",
//             "admissionDate": "10/10/25",
//             "revisionDate": "10/11/25",
//             "startDate": "10/11/25",
//             "status": "Active",
//             "medication": "Eliquis Oral Tablet 5 MG",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "10/11/25",
//             "orderStartDate": "10/11/25",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy r/t: A-Fib ",
//             "carePlanRevisionDate": "10/11/25",
//             "carePlanCreatedAt": "10/11/25"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Sharon",
//             "lastName": "Gonzalez",
//             "admissionDate": "4/21/25",
//             "revisionDate": "10/15/25",
//             "startDate": "10/15/25",
//             "status": "Active",
//             "medication": "Apixaban Tablet 5 MG",
//             "orderStatus": {
//                 "bgColor": "red",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center,
//                 "value": "",
//             },
//             "orderDescription":'',
//             "orderRevisionDate": "",
//             "orderStartDate": "",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy r/t: A-Fib ",
//             "carePlanRevisionDate": "4/22/25",
//             "carePlanCreatedAt": "4/22/25"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Willie",
//             "lastName": "Harris",
//             "admissionDate": "10/8/25",
//             "revisionDate": "10/15/25",
//             "startDate": "10/10/25",
//             "status": "Active",
//             "medication": "Warfarin Sodium Tablet 5 MG",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "10/9/25",
//             "orderStartDate": "10/9/25",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy r/t hx PE, LV mural thrombus",
//             "carePlanRevisionDate": "10/9/25",
//             "carePlanCreatedAt": "10/9/25"
//         },
//         {
//             "facilityName": "Atlas Post Acute at Woodbury Country Club",
//             "firstName": "Mark",
//             "lastName": "Inverso",
//             "admissionDate": "10/15/25",
//             "revisionDate": "10/15/25",
//             "startDate": "10/15/25",
//             "status": "Active",
//             "medication": "Apixaban Tablet 5 MG",
//             "orderStatus": {
//                 "value": "Active",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "orderRevisionDate": "10/15/25",
//             "orderStartDate": "10/15/25",
//             "orderDescription": "AHC: Anticoagulant Side Effect Monitoring: Observe for Signs and Symptoms of Bleeding/Bruising every shift. Document unusual findings in progress note and notify provider.",
//             "carePlanStatus": {
//                 "value": "Yes",
//                 "bgColor": "green",
//                 "color": "white",
//                 "textAlign": ExcelFileAlign.Center
//             },
//             "carePlanDescription": " I am on Anticoagulant therapy ",
//             "carePlanRevisionDate": "10/16/25",
//             "carePlanCreatedAt": "10/16/25"
//         }
//     ]
// }
// docFromTable(tableData, "Test Table").then(buffer => {
//     fs.writeFileSync("test.xlsx", Buffer.from(buffer));
//     console.log("File written successfully");
// });