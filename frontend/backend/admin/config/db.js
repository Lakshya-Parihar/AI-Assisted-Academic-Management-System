import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ams_db",
});

console.log("✅ MySQL connected successfully");

export default db;
