import  { Readable } from 'stream';
import fs from 'fs';
import { stringify } from 'csv-stringify/sync';
console.log('csv parser!');
import csvParser from 'csv-parser';
console.log('csv parser!');


export function  getJSONArrayFromCSVString<T>(csvString: string): Promise<T[]> {
    return getJSONArrayFromCSVStream(Readable.from(csvString));
}
export function getJSONArrayFromCSVFiles<T>(path: string): Promise<T>{
    return getJSONArrayFromCSVStream(fs.createReadStream(path))
}

export function getCSVStringFromJSONStringsArray(jsonArray: [])  {
    return jsonToCSV(jsonArray);
}

export function getCSVStringFromJSONObject(jsonObj: any) {
    const keys = Object.keys(jsonObj);
    const array = [keys];
    let numOfRows = 0;
    keys.forEach((item, index) => {
        if(! jsonObj[item]) {
            return;
        }
        const length = Array.isArray(jsonObj[item]) ? jsonObj[item].length : jsonObj[item] ? 1 : 0;
        if(numOfRows < length) {
            numOfRows = length;
        }
    })
    for (let index = 0; index < numOfRows; index++) {
        let row: any[] = [];
        array.push(row);
        keys.forEach((item) => {
            let element = jsonObj[item];
            if(index == 0){
                if(! Array.isArray(element)){
                    row.push(element);
                    return
                }
                row.push(element[0])
                return;
            }
            row.push( Array.isArray(element) ? element[index]: undefined);
        })    
    }

    return stringify(array);
}

function getJSONArrayFromCSVStream(readable: Readable): Promise<any> {
    return new Promise((resolve, reject) => {
        let jsonArray:any[] = [];
        readable.pipe(csvParser())
            .on('data', data => jsonArray.push(data))
            .on('close', () => {
                resolve(jsonArray);
            })
    })
}

function jsonToCSV(json: [] | {}) {
    if(Array.isArray(json)){
        return stringify(json)
    }
}