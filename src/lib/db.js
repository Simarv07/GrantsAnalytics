// Database connection helper using mssql in plain JS
// Reads configuration from environment variables.

const sql = require('mssql');

const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    trustServerCertificate: process.env.SQL_TRUST_CERT === 'true',
    enableArithAbort: true,
    encrypt: process.env.SQL_ENCRYPT !== 'false'
  }
};

let connectionPoolPromise = null;

async function getConnectionPool() {
  if (!connectionPoolPromise) {
    connectionPoolPromise = sql.connect(sqlConfig);
  }
  return connectionPoolPromise;
}

async function query(sqlText) {
  const pool = await getConnectionPool();
  const result = await pool.request().query(sqlText);
  return result.recordset;
}

module.exports = {
  sql,
  query,
  getConnectionPool,
};


