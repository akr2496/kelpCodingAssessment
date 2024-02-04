const express = require('express');
const app = express();
const fs = require("fs");
const util = require('util');
const db = require('./database');
const file = require('./file')


const client = db.client;
db.connectToDatabase(client);

/////print age distribution to console /////////////
const printAgeDistribution = () => {
  db.getAgeDistribution(client)
  .then((res) => console.log(res));
}
printAgeDistribution();


const upload = async() => {
  console.log('In upload helper function')
  try{
    let total_record = await db.totalRecord();
    console.log(total_record);
    await file.dataAccessAndUpload(total_record);
    console.log("uploaded")
  } catch(error) {
    console.log(`error has occcured while upload : ${error.message}`)
  }
}


app.post('/upload', (req, res) => {
  upload();
  res.send("uploaded")
})

app.post('/', (req, res) => {
  console.log(`i am hearing ping from ${req.url}, ${req.body}`)
  res.send("Got ping")
  // upload();
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

