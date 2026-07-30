const { Pool } = require('pg');
console.log("DB URL length:", process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 5000,
});
pool.query('SELECT NOW()').then(() => {
  console.log("Success");
  process.exit(0);
}).catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
