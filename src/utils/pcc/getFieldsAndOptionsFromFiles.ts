import * as fs from 'fs';
import csv from 'csv-parser';
const readCSVFile = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

const optionsFilePath = './files/options.csv';
const pccFieldsFilePath = './files/pccfields.csv';

const readFiles = async () => {
    try {
        const options = await readCSVFile(optionsFilePath);
        const pccFields = await readCSVFile(pccFieldsFilePath);
        console.log('Options:', options);
        console.log('PCC Fields:', pccFields);

        // const a = getPccFieldsAndOptions({fac_id: '19'} , pccFields, options);
        // console.log(a);
    } catch (error) {
        console.error('Error reading files:', error);
    }
};

readFiles();