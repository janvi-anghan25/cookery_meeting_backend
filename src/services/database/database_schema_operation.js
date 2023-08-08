import { decryptText } from '../../utils/utility';

export function mongooseMiddleware(schema, modelName) {
  if (
    modelName === 'AdminUsers' ||
    modelName === 'Users' ||
    modelName === 'chef_invoice' ||
    modelName === 'Chef'
  ) {
    schema.set('toObject', { getters: true });
    schema.set('toJSON', { getters: true });
  }

  return schema;
}

export const Mapping = (data) => {
  let mappedData = data;
  mappedData = mappedData.map((data) => {
    data.email = decryptText(data.email);
    data.phone_number = decryptText(data.phone_number);
    return data;
  });
  return mappedData;
};
