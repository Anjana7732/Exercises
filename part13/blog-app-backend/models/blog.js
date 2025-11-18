const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db')

const Blog = sequelize.define('blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isValidYear(value) {
        if (value !== null && value !== undefined) {
          const currentYear = new Date().getFullYear()
          // Check if value is an integer
          const yearNum = Number(value)
          if (!Number.isInteger(yearNum)) {
            throw new Error('Year must be an integer')
          }
          if (yearNum < 1991) {
            throw new Error('Year must be at least 1991')
          }
          if (yearNum > currentYear) {
            throw new Error(`Year cannot be greater than ${currentYear}`)
          }
        }
      }
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'blogs',
  timestamps: true,
  underscored: true
})

module.exports = Blog
