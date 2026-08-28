require('dotenv').config();
const {Pool} = require('pg');


const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

console.log(
    'DATABASE_HOST:',
    connectionString
         ? new URL(connectionString).hostname
         : 'NO DATABASE URL'
);

const pool = new Pool({
    connectionString,
   ssl: {
    rejectUnauthorized: false
   }
});
module.exports = pool;