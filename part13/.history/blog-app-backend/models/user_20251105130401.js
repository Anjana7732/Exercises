const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true // Exercise 13.9: Email validation
    }
  },
  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true // Exercise 13.8: Keep timestamps enabled
})

module.exports = User

