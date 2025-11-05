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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow null for migration, but enforce in application logic
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'blogs',
  timestamps: false
})

module.exports = Blog
