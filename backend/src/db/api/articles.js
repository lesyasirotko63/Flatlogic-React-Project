const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ArticlesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const articles = await db.articles.create(
      {
        id: data.id || undefined,

        title: data.title || null,
        body: data.body || null,
        featured: data.featured || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await articles.setAuthor(data.author || null, {
      transaction,
    });

    await articles.setCategory(data.category || null, {
      transaction,
    });

    await articles.setTags(data.tags || [], {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.articles.getTableName(),
        belongsToColumn: 'images',
        belongsToId: articles.id,
      },
      data.images,
      options,
    );

    return articles;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const articles = await db.articles.findByPk(id, {
      transaction,
    });

    await articles.update(
      {
        title: data.title || null,
        body: data.body || null,
        featured: data.featured || false,

        updatedById: currentUser.id,
      },
      { transaction },
    );

    await articles.setAuthor(data.author || null, {
      transaction,
    });

    await articles.setCategory(data.category || null, {
      transaction,
    });

    await articles.setTags(data.tags || [], {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.articles.getTableName(),
        belongsToColumn: 'images',
        belongsToId: articles.id,
      },
      data.images,
      options,
    );

    return articles;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const articles = await db.articles.findByPk(id, options);

    await articles.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await articles.destroy({
      transaction,
    });

    return articles;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const articles = await db.articles.findOne({ where }, { transaction });

    if (!articles) {
      return articles;
    }

    const output = articles.get({ plain: true });

    output.author = await articles.getAuthor({
      transaction,
    });

    output.category = await articles.getCategory({
      transaction,
    });

    output.tags = await articles.getTags({
      transaction,
    });

    output.images = await articles.getImages({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'author',
      },

      {
        model: db.categories,
        as: 'category',
      },

      {
        model: db.tags,
        as: 'tags',
        through: filter.tags
          ? {
              where: {
                [Op.or]: filter.tags.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.tags ? true : null,
      },

      {
        model: db.file,
        as: 'images',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.title) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('articles', 'title', filter.title),
        };
      }

      if (filter.body) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('articles', 'body', filter.body),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.featured) {
        where = {
          ...where,
          featured: filter.featured,
        };
      }

      if (filter.author) {
        var listItems = filter.author.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          authorId: { [Op.or]: listItems },
        };
      }

      if (filter.category) {
        var listItems = filter.category.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          categoryId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = await db.articles.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction,
    });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('articles', 'title', query),
        ],
      };
    }

    const records = await db.articles.findAll({
      attributes: ['id', 'title'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['title', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }
};
