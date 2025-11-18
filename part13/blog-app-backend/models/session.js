const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db')

const Session = sequelize.define('session', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'sessions',
  timestamps: true,
  underscored: true
})

module.exports = Session

