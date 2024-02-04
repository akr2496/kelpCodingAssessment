const fs = require("fs");
const util = require('util');
const dotenv = require('dotenv').config();
const parse = require('csv-parser');

const db = require('./database');

const client = db.client;
const file = '../detailsCSV.csv';

const readStream = fs.createReadStream(file);


const dataAccessAndUpload = async(recordCount) =>{
    console.log("in file module")
    
    // const file = '../economic-survey-of-manufacturing-sept-2023-csv.csv';
    const records = [];

    readStream
    .pipe(parse())
    .on('headers', (headers) => {
        csvHeaders = headers;
    })
    .on('data', async(row) => {
        const record = {};
        csvHeaders.forEach((csvHeader) => {
        const keys = csvHeader.split('.');
        let temp = record;
        keys.forEach((key, index) => {
            if(index === keys.length-1){
            temp[key] = row[csvHeader];
            } else {
            temp[key] = temp[key] || {};
            temp = temp[key];
            }
        })
        })
        // records.push(record);
        /*
            Implementing batch upload( instead of sequential stream upload) would be better 
            for data with recods > 50000
            if batch size id full --> upload
            else keep fill buffer array
        */
        try {
            recordCount++;
            await db.insertUser(client, record, recordCount);
            readStream.destroy();
        }
        catch(error){
            console.log(error)
        }

        // console.log(record);
        // console.log(util.inspect(record, {showHidden: false, depth: null, colors: true}))
        // console.log(util.inspect(record, {showHidden: false, depth: null, colors: true}))
    }).on('end', async() => {
        console.log("finished reading csv file");
        await client.end();
    }).on('error', (error) => {
        console.log(`error has occured ${error.message}`)
    })
}

module.exports = {
    dataAccessAndUpload,
}