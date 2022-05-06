const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const articles = sequelize.define(
    'articles',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      body: {
        type: DataTypes.TEXT,
      },

      featured: {
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

  articles.associate = (db) => {
    db.articles.belongsToMany(db.tags, {
      as: 'tags',
      constraints: false,
      through: 'articlesTagsTags',
    });

    db.articles.belongsTo(db.users, {
      as: 'author',
      constraints: false,
    });

    db.articles.belongsTo(db.categories, {
      as: 'category',
      constraints: false,
    });

    db.articles.hasMany(db.file, {
      as: 'images',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.articles.getTableName(),
        belongsToColumn: 'images',
      },
    });

    db.articles.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.articles.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return articles;
};
