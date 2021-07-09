const { fetchData } = require('../../utils/fetchData/fetchData');

const cashService = () => ({
  fetchCashIn: () => fetchData('cash-in'),
  fetchCashOutNatural: () => fetchData('cash-out-natural'),
  fetchCashOutJuridical: () => fetchData('cash-out-juridical'),
});

module.exports = { cashService };
