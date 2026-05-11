import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ams_db",
});

console.log("✅ Student DB connected");

export default db;
