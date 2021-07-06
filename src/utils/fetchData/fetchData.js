const fetch = require('node-fetch-cache');

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${process.env.OPERATION_FEE_URL}${endpoint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { fetchData };
