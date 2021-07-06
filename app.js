require('dotenv').config();
const { readFile } = require('fs').promises;

const filePath = process.argv.slice(2);
const { calculateFee } = require('./src/calculateFee/calculateFee');

async function init(filePath) {
  try {
    const data = await readFile(filePath, { encoding: 'utf8' });
    calculateFee(JSON.parse(data));
  } catch (error) {
    throw new Error(error.message);
  }
}

init(filePath.toString());
