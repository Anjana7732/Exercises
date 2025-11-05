const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in environment variables');
  process.exit(1);
}

// Determine if SSL is needed (check if URL contains sslmode or is a cloud database)
const needsSSL = process.env.DATABASE_URL.includes('sslmode=require') || 
                 process.env.DATABASE_URL.includes('amazonaws.com') ||
                 process.env.DATABASE_URL.includes('heroku') ||
                 process.env.DATABASE_URL.includes('render.com');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, 
  dialectOptions: needsSSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
});

module.exports = sequelize;
