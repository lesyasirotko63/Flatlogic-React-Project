const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const comments = sequelize.define(
    'comments',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      text: {
        type: DataTypes.TEXT,
      },

      moderated: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  comments.associate = (db) => {
    db.comments.belongsTo(db.users, {
      as: 'author',
      constraints: false,
    });

    db.comments.belongsTo(db.articles, {
      as: 'article',
      constraints: false,
    });

    db.comments.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.comments.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return comments;
};
