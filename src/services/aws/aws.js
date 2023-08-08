import AWS from 'aws-sdk';
import { constants as AWS_CONST } from '../../constant/aws';
import AmazonS3URI from 'amazon-s3-uri';
import { logger, level } from '../../config/logger';
const ID = AWS_CONST.S3_ACCESS_ID;
const SECRET = AWS_CONST.S3_SECRET_KEY;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const uploadFile = (
  file,
  fileName,
  contentType,
  bucketName,
  contentEncoding
) => {
  fileName = `${new Date().getTime()}-${fileName}`;
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    };

    if (contentEncoding && contentType) {
      params.ContentEncoding = contentEncoding;
      params.ContentType = contentType;
    }

    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });
};

const uploadNewFile = (
  bucketName,
  file,
  fileName,
  contentEncoding,
  contentType
) => {
  fileName = `${new Date().getTime()}-${fileName}`;
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    };

    const options = {
      partSize: 30 * 1024 * 1024,
      queueSize: 1,
    };

    if (contentEncoding && contentType) {
      params.ContentEncoding = contentEncoding;
      params.ContentType = contentType;
    }

    s3.upload(params, options, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });
};

const uploadPDFFile = (bucketName, file, fileName) => {
  fileName = `${new Date().getTime()}-${fileName}`;
  return new Promise((resolve, reject) => {
    // const params = {
    //   Bucket: bucketName,
    //   Key: fileName,
    //   Body: file,
    //   ContentType: 'image/jpeg',
    // };

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: 'application/pdf',
    };

    const options = {
      partSize: 30 * 1024 * 1024,
      queueSize: 1,
    };

    s3.upload(params, options, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });
};

const uploadVideoFile = (bucketName, file, fileName) => {
  fileName = `${new Date().getTime()}-${fileName}`;
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: 'video/mp4',
    };

    const options = {
      partSize: 30 * 1024 * 1024,
      queueSize: 1,
    };

    s3.upload(params, options, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });
};

const uploadCSVFile = (bucketName, file, fileName) => {
  fileName = `${new Date().getTime()}-${fileName}`;
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: 'application/octet-stream',
    };

    const options = {
      partSize: 30 * 1024 * 1024,
      queueSize: 1,
    };

    s3.upload(params, options, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });
};

const deleteFile = (bucketName, url) => {
  return new Promise((resolve, reject) => {
    try {
      const { key } = AmazonS3URI(url);
      const params = {
        Bucket: bucketName,
        Key: key,
      };

      s3.deleteObject(params, function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    } catch (err) {
      logger.log(level.error, `${url} is not a valid S3 uri err=${err}`);
    }
  });
};

export {
  uploadFile,
  deleteFile,
  uploadPDFFile,
  uploadVideoFile,
  uploadNewFile,
  uploadCSVFile,
};

/*
! aws example
* ******************************************************************************* *
export const uploadPicture = async (req, res) => {
  logger.log(
    level.debug,
    uploadPicture body=${JSON.stringify(req.body)}
  );
  let response, code;
  let sampleFile = req.files.sampleFile;
  try {
    let url = await uploadFile(sampleFile.data, sampleFile.name);
    code = HTTPStatus.OK;
    response = createSuccessResponseJSON(0, url);
  } catch (err) {
    logger.log(level.error, uploadPicture error=${err});
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, err);
  }
  return sendJSONResponse(res, code, response);
};
 
* ******************************************************************************* *
 */
