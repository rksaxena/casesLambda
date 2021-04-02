const aws = require('aws-sdk');

class AwsHelper {
  constructor(config) {
    const { s3Bucket } = config;
    const { ddbTable } = config;
    this.s3 = new aws.S3();
    this.ddb = new aws.DynamoDB().DocumentClient();
    this.s3Bucket = s3Bucket;
    this.ddbTable = ddbTable;
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

  ddbGet(key, onSuccess, onFailure) {
    const params = {
      TableName: this.ddbTable,
      Key: key,
    };

    this.ddb.get(params, (err, data) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(data.Item);
      }
    });
  }

  ddbScan(params, onSuccess, onFailure) {
    const scanParams = params;
    scanParams.TableName = this.ddbTable;
    this.ddb.scan(scanParams, (err, data) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(data);
      }
    });
  }

  ddbPut(item, onSuccess, onFailure) {
    const params = {
      TableName: this.ddbTable,
      Item: item,
    };
    this.ddb.put(params, (err, data) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(data);
      }
    });
  }

  ddbUpdate(item, onSuccess, onFailure) {
    const params = {
      TableName: this.ddbTable,
      Key: item.key,
      UpdateExpression: item.update_exp,
      ExpressionAttributeValues: item.exp_attr_val,
    };
    this.ddb.update(params, (err, data) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(data.Item);
      }
    });
  }
}

module.exports = {
  AwsHelper,
};
