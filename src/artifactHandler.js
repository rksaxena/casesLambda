const mime = require('mime-types');

const { logger } = require('./utils/logger');
const { AwsHelper } = require('./utils/awsHelper');

const S3_PATH = 'my-cases-artifacts';
const jsonMimeType = 'application/json';
const textMimes = [
  'application/javascript',
  'application/json',
  'text/javascript',
  'text/css',
  'text/html',
  'text/plain',
  'image/svg+xml',
];

/**
 * Returns a promise to get artifacts from S3 bucket given its path.
 *
 * @param {string} objectPath Contains the path from which artifacts have to be served.
 * @return {{mimeType: string, promise: Promise}}
 * returns a promise to get the object from S3 given its path and the object's mime type
 */
const serveArtifacts = (objectPath) => {
  // Determine the file's key path within the additional artifacts directory
  const fileKey = objectPath.substring(1);
  const mimeType = mime.lookup(fileKey);

  logger.info(`File key: ${fileKey}`);
  logger.info(`MimeType: ${mimeType}`);

  const awsHelper = new AwsHelper({
    s3Bucket: S3_PATH,
  });

  logger.info('Returning Promise to get S3 object');
  return {
    mimeType,
    promise: awsHelper.getS3Object(fileKey),
  };
};

const requestHandler = async (req, res, next) => {
  const { mimeType, promise } = serveArtifacts(req.path);
  promise
    .then((data) => {
      if (textMimes.includes(mimeType)) {
        const content = data.toString();
        res.status(200);
        res.type(mimeType);
        res.send(content);
      } else {
        res.status(200);
        res.type(mimeType);
        res.send(data);
      }
    })
    .catch((error) => {
      logger.error(`Error occurred: ${error.toString()}`);
      res.status(500);
      res.type(jsonMimeType);
      res.send('{"message":"internal server error"}');
    });
};

module.exports = { serveArtifacts, requestHandler };
