import * as fs from 'fs';
import { FacilitiesService } from '../../settings/facilities';


const facilitiesDbPath = './files/facilities_db.json';
const facilitiesDb = JSON.parse(fs.readFileSync(facilitiesDbPath, 'utf-8'));

const settings = new FacilitiesService(facilitiesDb);
const id = settings.sites['Anderson Mill Health and Rehab Center'];
console.log('names: ', settings.getFacilityEHRsNamesByIdsToArray());
