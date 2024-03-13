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

export const sendJSON = async function (url, uploadData) {
  try {
    // to make POST request add object of options as 2nd parameter of fetch() function
    const fetchPro = fetch(url, {
      method: `POST`, // specify method type
      // headers are information about request
      headers: {
        'Content-Type': `application/json`, // tell API that the data is json format
      },
      // actual data to send
      body: JSON.stringify(uploadData), // transforming data in json format
    });

    // using Promise.race() to prevent infinite fetching using custom timeout() function
    const response = await Promise.race([
      fetchPro,
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
