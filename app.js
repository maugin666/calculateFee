const { readFileSync } = require('fs');

const { prepareData } = require('./src/modules/calculateFee/calculateFee');

function init() {
  const filePath = process.argv.slice(2);
  const data = readFileSync(filePath.toString(), { encoding: 'utf8' });

  if (!data) throw new Error("Can't read file");

  prepareData(JSON.parse(data));
}

init();
