const { DataTypes } = require('sequelize');

const Blog = (sequelize, DataTypes) => {
  const BlogModel = sequelize.define('blog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    author: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  return BlogModel;
};

module.exports = Blog;
