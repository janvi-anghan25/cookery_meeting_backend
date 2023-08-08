import AWS from 'aws-sdk';

export const wasabiClient = new AWS.S3({
  endpoint: process.env.ENDPOINT,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  apiVersion: '',
  region: process.env.REGION,
});

export const uploadFile = (file, fileName, contentType, bucket) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file,
      // ContentLength: fileName.byteCount,
      ContentType: contentType,
    };
    wasabiClient.upload(params, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });
};

export const getFile = (fileName, bucket) => {
  return new Promise((resolve, reject) => {
    wasabiClient.getObject(
      {
        Bucket: bucket,
        Key: fileName,
      },
      function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
};
