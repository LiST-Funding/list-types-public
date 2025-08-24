import { ReadStatus, SnfPatientDetails } from "../patient";
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { PCCField } from "../pcc";
// import csv2json from 'csv2json';

function swapKeysAndValues(obj: { [s: string]: unknown; } | ArrayLike<unknown>) {
  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    acc[value as string] = key;
    return acc;
  }, {});
}


export interface EHR {
  // list ehr name : display Name
  names: { [key in string]: string };

}

export interface FacilitiySettings {
  EHR: EHR;
  facilities: Facilities;
  statuses: Statuses;
  selectFields?: PCCField[];
}
export interface Facilities {
  names: { [key in string]: number };
  allNames: { [key in string]: number };
  namesPerEhr: { [key in string]: { [key in string]: string } };
  displayNames: { [key in number]: string };
}

export interface Statuses {
  names: string[];
  namesPerEhr: { [key in string]: { [key in string]: string } }
}


export function exportAllFacilitiesToCsv(settings: FacilitiySettings) {
  let result: any[] = [];
  Object.keys(settings.facilities.names).forEach(facilityName => {
    let facilityId = settings.facilities.names[facilityName];
    let facility: any = { facilityName, facilityId };
    Object.keys(settings.EHR.names).forEach(ehrName => {
      let ehrFacilityName = settings.facilities.namesPerEhr[ehrName][facilityName];
      facility[ehrName] = ehrFacilityName || '';
    })
    result.push(facility);
  })
  return result;

}

export function importSettingsFromCsv(path: string) {
  const csvString = fs.readFileSync(path, 'utf8');
  const records = parse(csvString, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const result = records.map((record: any) => {
    const obj: { [key: string]: any } = {};
    for (const key in record) {
      obj[key] = record[key].replace(/^"|"$/g, '');
    }
    return obj;
  });

  const ehrNames = Object.keys(result[0]).filter(key => key !== 'facilityName' && key !== 'facilityId');
  const ehrNamesMap = ehrNames.reduce((acc: any, ehr) => {
    acc[ehr] = ehr;
    return acc;
  }, {});

  const facilities: { [key: string]: string } = {};
  const namesPerEhr: { [key: string]: { [key: string]: string } } = {};
  const statuses: Statuses = {
    names: [],
    namesPerEhr: {}
  };

  result.forEach((row: any) => {

    const facilityName = row.facilityName;
    const facilityId = row.facilityId;
    const ehrNames = Object.keys(row).filter(key => key !== 'facilityName' && key !== 'facilityId');

    facilities[facilityName] = facilityId;

    ehrNames.forEach((ehr: any) => {
      if (!namesPerEhr[ehr]) {
        namesPerEhr[ehr] = {};
      }
      namesPerEhr[ehr][facilityName] = row[ehr];

      if (!statuses.names.includes(row[ehr])) {
        statuses.names.push(row[ehr]);
      }

      if (!statuses.namesPerEhr[ehr]) {
        statuses.namesPerEhr[ehr] = {};
      }
      statuses.namesPerEhr[ehr][facilityName] = row[ehr];
    });
  });

  const facilitySettings: FacilitiySettings = {
    EHR: {
      names: facilities
    },
    facilities: {
      names: facilities as any,
      namesPerEhr: namesPerEhr,
      allNames: {},
      displayNames: {},
    },
    statuses: statuses
  };
  facilitySettings.EHR.names = ehrNamesMap;
  return facilitySettings;
}

export class FacilitiesService implements FacilitiySettings {
  EHR: EHR;
  facilities: Facilities;
  statuses: Statuses;
  facilitySettingsActive?: boolean;

  mapEhrDisplayNameToNames: { [key in string]: string } = {};
  mapEhrFacilityNamesToPccNames: { [key in string]: { [key in string]: string } } = {};
  sites: { [key in string]: number };
  allSites: { [key in string]: number };
  sitedIds: { [key in string]: string } = {};
  allSiteIds: { [key in string]: string } = {};
  displayNames: Record<number, string> = {};

  constructor(json: { EHR: EHR, facilities: Facilities, statuses: Statuses, facilitySettingsActive?: boolean }) {
    this.EHR = json?.EHR || {};
    this.facilities = json?.facilities || {};
    this.statuses = json?.statuses;
    this.facilitySettingsActive = json.facilitySettingsActive;

    this.sites = this.facilities.names;
    this.allSites = this.facilities.allNames ?? this.sites;
    this.displayNames = this.facilities.displayNames ?? {};

    if(this.EHR?.names) {
      Object.keys(this.EHR.names).forEach(ehrName => {
        this.mapEhrFacilityNamesToPccNames[ehrName] = swapKeysAndValues(this.facilities.namesPerEhr[ehrName]);
      })
      this.mapEhrDisplayNameToNames = swapKeysAndValues(this.EHR.names);
      Object.keys(this.sites).forEach(item => this.sitedIds[this.sites[item]] = item);
      Object.keys(this.allSites).forEach(item => this.allSiteIds[this.allSites[item]] = item);   
    }
  }


  getFacilityEHRsNames(facilityName: string): { [key in string]: string } {
    let result: any = {};
    Object.keys(this.EHR.names).forEach((ehr: string) => {
      let name = this.facilities.namesPerEhr[ehr][facilityName];
      if (name) {
        result[ehr] = name;
      }
    })
    return result;
  }

  getFacilityEHRsNamesByIds(facilityId: number): { [key in string]: string } {
    const name = this.sitedIds[facilityId];
    return this.getFacilityEHRsNames(name);
  }

  getFacilityEHRsNamesByIdsToArray(facilityId?: number): string[] {
    const name = this.sitedIds[facilityId + '' || ''];
    if(name)
      return Object.values(this.getFacilityEHRsNames(name));
    else {
      const s = new Set<string>();
      Object.keys(this.facilities.names).forEach((name: string) => {
        Object.values(this.getFacilityEHRsNames(name)).forEach((value: string) => {
          s.add(value);
        });
      });
      return Array.from(s);
    }
  }



  getSiteName(ehrDisplayName: string, name: string) {
    const ehr = this.mapEhrDisplayNameToNames[ehrDisplayName];
    return this.getSiteNameByEhr(ehr, name);
  }

  getSiteNameByEhr(ehrName: string, name: string) {
    let map = this.mapEhrFacilityNamesToPccNames[ehrName];
    return map ? map[name] || name : name;
  }
  getSiteIdByName(name: string, ehr?: string) {
    name = ehr ? this.getSiteNameByEhr(ehr, name) : name;
    return this.sites[name];
  }

  exportAllFacilitiesToCsv() {
    let result: any[] = [];
    Object.keys(this.facilities.names).forEach(facilityName => {
      let facilityId = this.facilities.names[facilityName];
      let facility: any = { facilityName, facilityId };
      Object.keys(this.EHR.names).forEach((ehrName: string) => {
        let ehrFacilityName = this.facilities.namesPerEhr[ehrName][facilityName];
        facility[ehrName] = ehrFacilityName || '';
      })
      result.push(facility);
    })
    return result;
  }

  updateStatus(basePatientInfo: SnfPatientDetails) {
    if (!basePatientInfo.userLastTimeView) {
      basePatientInfo.readStatus = ReadStatus.NEVER_READ;
    } else {
      if (new Date(basePatientInfo.userLastTimeView) < new Date(basePatientInfo.lastTimeUpdate as Date)) {
        basePatientInfo.readStatus = ReadStatus.READ_BEFORE_UPDATES;
      } else {
        basePatientInfo.readStatus = ReadStatus.READ;
      }
    }

  }

  getDisplayName(idOrName: string | number) {
    return this.displayNames[idOrName as number] || this.allSites[idOrName as string] || idOrName;
  }

}

// TEST FROM CSV TO JSON
// const json = importSettingsFromCsv('/Users/izikalgrisi/Desktop/facilities_out.csv');
// const service = new FacilitiesService(json);

// // TEST FROM JSON TO CSV
// // const jsonPath = '/Users/izikalgrisi/Desktop/facilities.json';
// // const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
// // const service = new FacilitiesService(json);

// console.log('convert allScripts site name to pcc site name');
// console.log(service.getSiteName('Navi', 'Cartersville Nursing, LLC'));
// console.log('convert not existing site name to pcc site name', service.getSiteName('AllScripts', 'not existing site name'));
// console.log('get facilityies ehr', service.getFacilityEHRsNames('Cartersville Nursing'));
// console.log('get facility id', service.getSiteIdByName('Cartersville Nursing, LLC', 'Navi'));
// console.log('get facility id', service.getSiteIdByName('Cartersville Nursing'));

// function escapeCsvValue(value: string): string {
//   if (value && typeof value == 'string' && value.includes(',')) {
//     return `"${value}"`;
//   }
//   return value;
// }
// const headers = ['facilityName', 'facilityId', ...Object.keys(service.EHR.names)];
// const csvContent = headers.join(",") + '\n' + service.exportAllFacilitiesToCsv()
//   .map(row => Object.values(row).map(value => escapeCsvValue(value as string)).join(','))
//   .join('\n');

// fs.writeFileSync('/Users/izikalgrisi/Desktop/facilities_out.csv', csvContent);


