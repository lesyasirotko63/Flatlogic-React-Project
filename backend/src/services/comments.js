const db = require('../db/models');
const CommentsDBApi = require('../db/api/comments');

module.exports = class CommentsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await CommentsDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let comments = await CommentsDBApi.findBy({ id }, { transaction });

      if (!comments) {
        throw new ValidationError('commentsNotFound');
      }

      await CommentsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return comments;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await CommentsDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
