const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CommentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const comments = await db.comments.create(
      {
        id: data.id || undefined,

        text: data.text || null,
        moderated: data.moderated || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await comments.setAuthor(data.author || null, {
      transaction,
    });

    await comments.setArticle(data.article || null, {
      transaction,
    });

    return comments;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const comments = await db.comments.findByPk(id, {
      transaction,
    });

    await comments.update(
      {
        text: data.text || null,
        moderated: data.moderated || false,

        updatedById: currentUser.id,
      },
      { transaction },
    );

    await comments.setAuthor(data.author || null, {
      transaction,
    });

    await comments.setArticle(data.article || null, {
      transaction,
    });

    return comments;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const comments = await db.comments.findByPk(id, options);

    await comments.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await comments.destroy({
      transaction,
    });

    return comments;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const comments = await db.comments.findOne({ where }, { transaction });

    if (!comments) {
      return comments;
    }

    const output = comments.get({ plain: true });

    output.author = await comments.getAuthor({
      transaction,
    });

    output.article = await comments.getArticle({
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
        model: db.articles,
        as: 'article',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.text) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('comments', 'text', filter.text),
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

      if (filter.moderated) {
        where = {
          ...where,
          moderated: filter.moderated,
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

      if (filter.article) {
        var listItems = filter.article.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          articleId: { [Op.or]: listItems },
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

    let { rows, count } = await db.comments.findAndCountAll({
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
          Utils.ilike('comments', 'id', query),
        ],
      };
    }

    const records = await db.comments.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }
};
