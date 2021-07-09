require('dotenv').config();
const { readFile } = require('fs').promises;

const { returnFee, calculateNaturalCashOutFee } = require('./src/calculateFee/calculateFee');
const { getFees } = require('./src/operationFees/operationFees');

async function init() {
  const filePath = process.argv.slice(2);
  try {
    const data = await readFile(filePath.toString(), { encoding: 'utf8' });
    const fees = await getFees();
    const countFee = calculateNaturalCashOutFee();
    await returnFee(JSON.parse(data), fees, countFee);
  } catch (error) {
    console.error(error);
  }
}

init();
