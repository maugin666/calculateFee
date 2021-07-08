const fetch = require('node-fetch-cache');

const operationFeeURL = 'https://private-00d723-paysera.apiary-proxy.com/';

async function fetchData(endpoint) {
  const response = await fetch(`${operationFeeURL}${endpoint}`);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return await response.json();
}

module.exports = { fetchData };
