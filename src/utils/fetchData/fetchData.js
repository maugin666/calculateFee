const fetch = require('node-fetch-cache');

const operationFeeURL = 'https://private-00d723-paysera.apiary-proxy.com/';

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${operationFeeURL}${endpoint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { fetchData };
