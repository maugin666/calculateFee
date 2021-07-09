const { fetchBuilder, FileSystemCache } = require('node-fetch-cache');

const fetch = fetchBuilder.withCache(new FileSystemCache({
  cacheDirectory: '',
  ttl: 300000,
}));
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
