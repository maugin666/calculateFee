const fetch = require('node-fetch-cache');

const operationFeeURL = 'https://private-00d723-paysera.apiary-proxy.com/';

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${operationFeeURL}${endpoint}`);
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { fetchData };
