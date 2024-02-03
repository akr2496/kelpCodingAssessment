const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const parse = require('csv-parser');
const fs = require("fs");
const util = require('util')

// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))

// alternative shortcut
// console.log(util.inspect(myObject, false, null, true /* enable colors */))
// fs.readFile("../detailsCSV.csv", "utf-8", (err, data) => {
//   if (err) console.log(err);
//   else console.log(data);
// });
// var csvHeaders;
console.log(dotenv.parsed.FILE_LOCATION);
// const file = '../detailsCSV.csv';
const file = '../economic-survey-of-manufacturing-sept-2023-csv.csv';
fs.createReadStream(file)
  .pipe(parse())
  .on('headers', (headers) => {
    csvHeaders = headers;
  })
  .on('data', (row) => {
    const record = {};
    let keyStack = [];
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
    // console.log(record);
    console.log(util.inspect(record, {showHidden: false, depth: null, colors: true}))
  }).on('end', () => {
    console.log("finished reading csv file")
  }).on('error', (error) => {
    console.log(`error has occured ${error.message}`)
  })

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

