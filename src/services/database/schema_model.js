import DBOperation from './database_operation';
import { logger, level } from '../../config/logger';

export default class SchemaModel {
  constructor(model) {
    this.model = model;
  }

  async add(adminUser) {
    return new Promise((resolve, reject) => {
      try {
        const addedAdminUser = Promise.resolve(
          DBOperation.create(this.model, adminUser)
        );
        resolve(addedAdminUser);
      } catch (err) {
        reject(err);
      }
    });
  }

  async isExist(filter, option) {
    let isExist = false;
    try {
      const adminUser = await DBOperation.get(this.model, filter, null, option);
      if (adminUser.length > 0) {
        isExist = true;
      }
    } catch (err) {
      logger.log(level.error, err);
    }
    return isExist;
  }

  async get(filter, returnField, option) {
    return new Promise((resolve, reject) => {
      try {
        const adminUser = Promise.resolve(
          DBOperation.get(this.model, filter, returnField, option)
        );
        resolve(adminUser);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getFilter(filter, option) {
    return new Promise((resolve, reject) => {
      try {
        const adminUser = Promise.resolve(
          DBOperation.getFilter(this.model, filter, option)
        );
        resolve(adminUser);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getAll(option) {
    return new Promise((resolve, reject) => {
      try {
        const allAdminUser = Promise.resolve(
          DBOperation.get(this.model, {}, null, option)
        );
        resolve(allAdminUser);
      } catch (err) {
        reject(err);
      }
    });
  }

  async list(filter, returnField, populateObj, option) {
    return new Promise((resolve, reject) => {
      try {
        const category = Promise.resolve(
          DBOperation.list(this.model, filter, returnField, populateObj, option)
        );
        resolve(category);
      } catch (err) {
        reject(err);
      }
    });
  }

  async count(filter) {
    return new Promise((resolve, reject) => {
      try {
        const countDocument = Promise.resolve(
          DBOperation.count(this.model, filter)
        );
        resolve(countDocument);
      } catch (err) {
        reject(err);
      }
    });
  }

  async update(filter, updatedField) {
    return new Promise((resolve, reject) => {
      try {
        const updatedAdminUser = Promise.resolve(
          DBOperation.update(this.model, filter, updatedField)
        );
        resolve(updatedAdminUser);
      } catch (err) {
        reject(err);
      }
    });
  }

  async delete(filter) {
    return new Promise((resolve, reject) => {
      try {
        const deletedAdmin = Promise.resolve(
          DBOperation.delete(this.model, filter)
        );
        resolve(deletedAdmin);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteMultiple(filter) {
    return new Promise((resolve, reject) => {
      try {
        const deletedAdmin = Promise.resolve(
          DBOperation.deleteMultiple(this.model, filter)
        );
        resolve(deletedAdmin);
      } catch (err) {
        reject(err);
      }
    });
  }

  async updateMany(filter, updatedField, option) {
    return new Promise((resolve, reject) => {
      try {
        const updatedStoreOwnerPackages = Promise.resolve(
          DBOperation.updateMany(this.model, filter, updatedField, option)
        );
        resolve(updatedStoreOwnerPackages);
      } catch (err) {
        reject(err);
      }
    });
  }

  async aggregate(pipeline) {
    return new Promise((resolve, reject) => {
      try {
        const agreegatedData = Promise.resolve(
          DBOperation.aggregate(this.model, pipeline)
        );
        resolve(agreegatedData);
      } catch (err) {
        reject(err);
      }
    });
  }
}
