/**
 * Script to fix database schema mismatch
 * This script drops and recreates tables with correct column names
 * 
 * Run this BEFORE running migrations if you're getting "column does not exist" errors
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in environment variables');
  process.exit(1);
}

const needsSSL = process.env.DATABASE_URL.includes('sslmode=require') || 
                 process.env.DATABASE_URL.includes('amazonaws.com') ||
                 process.env.DATABASE_URL.includes('heroku') ||
                 process.env.DATABASE_URL.includes('render.com');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: console.log,
  dialectOptions: needsSSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
});

async function fixDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected successfully!');

    console.log('\nDropping existing tables...');
    await sequelize.query('DROP TABLE IF EXISTS blogs CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS users CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "SequelizeMeta" CASCADE;');
    console.log('Tables dropped successfully!');

    console.log('\n✅ Database is now ready for migrations.');
    console.log('Next steps:');
    console.log('1. Run: npm run migrate');
    console.log('2. Start server: node index.js');

  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

fixDatabase();

