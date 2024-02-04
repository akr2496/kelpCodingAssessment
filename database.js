const { Client } = require('pg');
const dotenv = require('dotenv').config();
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))


const {HOSTNAME, USER, PASSWORD, DATABASE, PORT} = dotenv.parsed;
const client = new Client({
    host     : HOSTNAME,
    user     : USER,
    password : PASSWORD,
    database : DATABASE,
    port     : PORT
    });

// connecting to DB
const connectToDatabase = async(client) =>{
    try{
        await client.connect();
    } catch (error) {
        console.log(`error occured while connecting to DB : ${error.message}`)
    }
}

// retrieving total record in db
const totalRecord = async() => {
    const query = `
        SELECT COUNT(*) as count FROM public.users;
    `;
    let output;
    try {
        const res = await client.query(query);
        output = res.rows[0].count;
    }catch (error){
        console.log(`error while fetching totalRecord : ${error.message}`)
    }
    return output;
}

///creating table inn db
const createTable = async(client) => {
    const query = `
            CREATE TABLE public.users (
              "name" varchar NOT NULL,
              age int4 NOT NULL,
              address jsonb NULL,
              additional_info jsonb NULL,
              id serial4 NOT NULL
            );
          `;
    try{
        const res = await client.query(query);
        console.log("Table public.users created successfully")
      } catch (error){
        console.log(`error occure while creating table : ${error.message}`)
      }
  }
  
  //// Insert user to table (public.users)
  const insertUser = async(client, record, id) => {
    let {name, age, address, ...additional_info} = record;
    name = name.firstName + ' ' + name.lastName;
    const query = `
        INSERT INTO users (name, age, address, additional_info, id)
        VALUES ($1, $2, $3, $4, $5);
      `;

    try {
      await client.query(query, [name, age, address, additional_info, id]);
    } catch(error){
      console.log(`insertion error : ${error.message}`)
    }
  }

  //// get data from table (pblic.users)
  const getAllData = async(client) => {
    const query = `
        SELECT * FROM public.users
    `;
    try {
        const res = await client.query(query);
        return res.rows;
    } catch (error){
        console.log(`Error has occured in getAllData : ${error.message}`)
    }
    return '';
  };

  ///// fetch age distribution from users
  const getAgeDistribution = async(client) => {
    const query = `
        WITH age_counts AS (
          SELECT
              CASE
                  WHEN age BETWEEN 0 AND 19 THEN '<20'
                  WHEN age BETWEEN 20 AND 39 THEN '20-39'
                  WHEN age BETWEEN 40 AND 60 THEN '40-60'
                  ELSE '>60'
              END AS age_range,
              COUNT(*) AS count
          FROM public.users
          GROUP BY age_range
        ORDER BY MIN(age)
      ), 
      total_users AS (
        SELECT COUNT(*) AS total_users FROM public.users
      )
      SELECT age_counts.age_range,
          (age_counts.count *100.0 / total.total_users) AS percent_distribution
      FROM age_counts
      CROSS JOIN total_users total 
    `;
    let output;
    try {
      const res = await client.query(query);
    //   console.log(res.rows)
      output = res.rows;
    } catch (error) {
      console.log(`Error occured while fetching getAgeDistribution : ${error.message}`)
    }
    return output;
  }

  module.exports = {
    client,
    totalRecord,
    connectToDatabase,
    createTable,
    getAgeDistribution,
    getAllData,
    insertUser
  }