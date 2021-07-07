require('dotenv').config();
const { readFile } = require('fs').promises;

const { calculateFee } = require('./src/calculateFee/calculateFee');

async function init() {
  const filePath = process.argv.slice(2);
  try {
    const data = await readFile(filePath.toString(), { encoding: 'utf8' });
    await calculateFee(JSON.parse(data));
  } catch (error) {
    console.error(error);
  }
}

init();
