// ============================================================================
// Database Configuration: Sequelize ORM
// Purpose: Establishes connection to the database (supports MySQL & SQLite)
// Suitable for: 2nd Semester Software Engineering & ORM Evaluation
// ============================================================================

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Step 1: Read database credentials from environment variables (.env file)
const dbDialect = process.env.DB_DIALECT || 'sqlite';
const dbName = process.env.DB_NAME || 'mindcare_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

let sequelize;

// Step 2: Initialize Sequelize instance
// - If MySQL is specified in .env, connect to MySQL server
// - Default: Use SQLite (mindcare.sqlite) for reliable zero-configuration demonstration in viva
if (dbDialect === 'mysql') {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false, // Set to false to keep terminal clean and readable
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../mindcare.sqlite'),
    logging: false,
  });
}

async function initDatabase() {
  try {
    if (dbDialect === 'mysql') {
      try {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({
          host: dbHost,
          port: dbPort,
          user: dbUser,
          password: dbPassword,
        });
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await conn.end();
      } catch (err) {
        console.warn(`⚠️ MySQL db creation warning: ${err.message}`);
      }
    }

    await sequelize.authenticate();
    console.log(`✅ Database connected successfully (${sequelize.getDialect()}).`);
    return sequelize;
  } catch (error) {
    console.warn(`⚠️ Failed to connect using ${dbDialect}: ${error.message}`);
    console.log('🔄 Initializing SQLite database for zero-config execution...');

    // Reinitialize to SQLite
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../mindcare.sqlite'),
      logging: false,
    });
    await sequelize.authenticate();
    console.log('✅ SQLite database connected successfully.');
    return sequelize;
  }
}

module.exports = { sequelize, initDatabase };
