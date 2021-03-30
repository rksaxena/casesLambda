const aws = require('aws-sdk');

class AwsHelper {
  constructor(config) {
    const { s3Bucket } = config;
    this.s3 = new aws.S3();
    this.s3Bucket = s3Bucket;
  }

  /**
   * Returns a promise for getting the file passed as parameter from
   * the bucket configured in constructor
   * @param {string} key The file which has to be gotten from the bucket in the constructor.
   * @returns {Promise<unknown>} Promise to get the file from the bucket in the constructor.
   */
  async getS3Object(key) {
    return new Promise((resolve, reject) => {
      this.s3.getObject(
        {
          Bucket: this.s3Bucket,
          Key: key,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data.Body);
        },
      );
    });
  }
}

module.exports = {
  AwsHelper,
};
