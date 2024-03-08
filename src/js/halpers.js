import * as cfg from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// helper function to make AJAX calls
export const getJSON = async function (url) {
  try {
    // using Promise.race() to prevent infinite fetching
    const response = await Promise.race([
      fetch(url),
      timeout(cfg.TIMEOUT_REQUEST_SEC),
    ]);
    const dataResponse = await response.json();
    // guard clause to check response
    if (!response.ok)
      throw new Error(`Something went wrong: ${dataResponse.message}`);

    return dataResponse;
  } catch (err) {
    throw err;
  }
};
