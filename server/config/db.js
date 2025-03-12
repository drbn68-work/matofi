import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || "matofiuser",
  password: process.env.POSTGRES_PASSWORD || "SecurePass123",
  database: process.env.POSTGRES_DB || "matofi_db",
  ssl: false, // Deshabilita SSL si no es necesario
});

export default pool;
