const db = require('../db/models');
const TagsDBApi = require('../db/api/tags');

module.exports = class TagsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await TagsDBApi.create(data, {
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
      let tags = await TagsDBApi.findBy({ id }, { transaction });

      if (!tags) {
        throw new ValidationError('tagsNotFound');
      }

      await TagsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return tags;
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

      await TagsDBApi.remove(id, {
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
