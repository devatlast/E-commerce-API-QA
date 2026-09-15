require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;   // 1. declare first

console.log(
    'DATABASE_HOST:',
    connectionString
        ? new URL(connectionString).hostname
        : 'NO DATABASE URL'
);

const isLocalDb = connectionString?.includes('@db:') || connectionString?.includes('localhost');   // 2. then this

const pool = new Pool({
    connectionString,
    ssl: isLocalDb ? false : { rejectUnauthorized: false }   // 3. then use it here
});

module.exports = pool;