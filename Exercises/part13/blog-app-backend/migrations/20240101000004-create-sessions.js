'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index on token for faster lookups
    await queryInterface.addIndex('sessions', ['token'], {
      unique: true,
      name: 'sessions_token_unique'
    });

    // Add index on user_id for faster queries
    await queryInterface.addIndex('sessions', ['user_id'], {
      name: 'sessions_user_id_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('sessions', 'sessions_user_id_index');
    await queryInterface.removeIndex('sessions', 'sessions_token_unique');
    await queryInterface.dropTable('sessions');
  }
};

