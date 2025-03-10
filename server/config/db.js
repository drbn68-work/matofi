// db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "matofiuser",
  password: process.env.DB_PASS || "SecurePa$$w0rd",
  database: process.env.DB_NAME || "matofidb",
});

export default pool;
