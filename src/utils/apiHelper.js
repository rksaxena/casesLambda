const axios = require('axios');
const { logger } = require('./logger');

class ApiError extends Error {
  constructor(statusCode, message, serverMessage) {
    super(message);
    this.statusCode = statusCode || 500;
    this.serverMessage = serverMessage;
  }
}

/**
 * Sends a to the given URL with the given options
 * and returns the JSON response
 *
 * @param {String} url
 * @param {Object} [opts={}] Optional parameters for the fetch request
 */

async function request(url, opts = {}) {
  try {
    const response = await axios(url, { ...opts });
    return response.data;
  } catch (error) {
    let errCause = 'No Request Made';
    let errCode = 505;
    let serverMsg = '';
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error(`Error code: ${error.response.status}`);
      logger.error(`Error message: ${error.response.statusText}`);
      errCause = error.response.statusText;
      errCode = error.response.status;
      serverMsg = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      errCause = 'The request was made but no response was received';
      errCode = 500;
    } else {
      // Something happened in setting up the request that triggered an Error
      errCause = 'Oops something went wrong';
      errCode = 500;
    }
    const errorMsg = `Error while calling url [${url}]: ${errCause}`;
    throw new ApiError(errCode, errorMsg, serverMsg);
  }
}

module.exports = { request };
