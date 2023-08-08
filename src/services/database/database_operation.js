import { Schema, model } from 'mongoose';
import { logger, level } from '../../config/logger';
import { plugin } from 'mongoose-auto-increment';
import { mongooseMiddleware } from './database_schema_operation';

const timestamps = { createdAt: 'created_at', updatedAt: 'updated_at' };
// database class for crud operation

class DatabaseOperation {
  // create monogoDB model
  createModel(modelName, schema) {
    try {
      let newSchema = new Schema(schema, { timestamps });
      // use hooks
      // addHooks(newSchema,modelName)
      newSchema = mongooseMiddleware(newSchema, modelName);
      newSchema.plugin(plugin, {
        model: modelName,
        field: '_id',
        startAt: 1,
        incrementBy: 1,
        sparse: true,
      });

      return model(modelName, newSchema);
    } catch (e) {
      logger.log(level.error, e);
    }
  }

  async getModel(_modelName) {}

  // create new document
  async create(modelClass, obj) {
    // async create(model) {
    const model = new modelClass(obj);
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(model.save());
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Get Document
  async get(modelClass, obj, returnField, options) {
    return new Promise((resolve, reject) => {
      const opArgs = {};
      if (options && options.page && options.limit) {
        opArgs.skip = options.page > 0 ? (options.page - 1) * options.limit : 0;
      }
      options && options.limit ? (opArgs.limit = options.limit) : '';
      options && options.sort ? (opArgs.sort = options.sort) : '';
      try {
        const data = Promise.resolve(modelClass.find(obj, returnField, opArgs));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Get Document By Id
  async getById(modelClass, obj, returnField, options) {
    return new Promise((resolve, reject) => {
      const opArgs = {};
      if (options && options.page && options.limit) {
        opArgs.skip = options.page > 0 ? (options.page - 1) * options.limit : 0;
      }
      options && options.limit ? (opArgs.limit = options.limit) : '';
      options && options.sort ? (opArgs.sort = options.sort) : '';
      try {
        const data = Promise.resolve(
          modelClass.findById(obj, returnField, opArgs)
        );
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Count Documents
  async count(modelClass, filter) {
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(modelClass.countDocuments(filter));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // update document
  async update(modelClass, filter, updatedField, opts) {
    const option = {
      new: true, // return updated doc
      runValidators: true, // validate before update
      omitUndefined: true,
      upsert: true,
      opts,
    };
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(
          modelClass.findOneAndUpdate(filter, updatedField, option)
        );
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // update many document
  async updateMany(modelClass, filter, updatedField, updateOption) {
    let option = {
      new: true, // return updated doc
    };

    if (updateOption) option = { ...option, ...updateOption };
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(
          modelClass.updateMany(filter, updatedField, option)
        );
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // delete document
  async delete(modelClass, filter) {
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(modelClass.findOneAndRemove(filter));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteMultiple(modelClass, filter) {
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(modelClass.deleteMany(filter));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // agreegate document
  async aggregate(modelClass, pipeline) {
    try {
      const data = await modelClass.aggregate(pipeline).exec();
      logger.log(level.debug, `agreegate = ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      logger.log(level.error, `agreegate err=${err}}`);
    }
  }

  // populate document
  async list(modelClass, obj, returnField, populateObj, options) {
    return new Promise((resolve, reject) => {
      const opArgs = {};
      if (options && options.page && options.limit) {
        opArgs.skip = options.page > 0 ? (options.page - 1) * options.limit : 0;
      }
      options && options.limit ? (opArgs.limit = options.limit) : '';
      options && options.sort ? (opArgs.sort = options.sort) : '';
      try {
        const data = Promise.resolve(
          modelClass.find(obj, returnField, opArgs).populate(populateObj)
        );
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }
}
export default new DatabaseOperation();
