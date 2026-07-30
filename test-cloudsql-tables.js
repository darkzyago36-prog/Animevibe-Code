require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME,
});
pool.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'").then(res => { console.log(res.rows); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
