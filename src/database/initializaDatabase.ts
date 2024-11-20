import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const createDatabaseAndTable = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DBSERVER,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
  });

  try {
    // Step 1: Create the database if it doesn't exist
    await connection.query("CREATE DATABASE IF NOT EXISTS PersonsDB");
    console.log("Database 'PersonsDB' created or already exists.");

    // Step 2: Use the database
    await connection.query("USE PersonsDB");

    // Step 3: Create the 'Person' table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Person (
        id INT(11) NOT NULL,
        fname VARCHAR(30) DEFAULT NULL,
        lname VARCHAR(100) DEFAULT NULL,
        birth DATE DEFAULT NULL,
        PRIMARY KEY (id)
      )
    `;

    await connection.query(createTableQuery);
    console.log("Table 'Person' created or already exists.");
  } catch (error) {
    console.error("Error creating database or table:", error);
  } finally {
    await connection.end();
  }
};

// Execute the function
createDatabaseAndTable();
