const { fetchData } = require('../utils/fetchData/fetchData');

const cashService = () => ({
  fetchCashIn: () => fetchData('cash-in'),
  fetchCashOutNatural: () => fetchData('cash-out-natural'),
  fetchCashOutJuridical: () => fetchData('cash-out-juridical'),
});

async function getFees() {
  let cashInFee;
  let cashOutNatural;
  let cashOutJuridical;
  const service = cashService();
  try {
    cashInFee = await service.fetchCashIn();
    cashOutNatural = await service.fetchCashOutNatural();
    cashOutJuridical = await service.fetchCashOutJuridical();
  } catch (error) {
    throw new Error(error);
  }
  return {
    cashInFee,
    cashOutNatural,
    cashOutJuridical,
  };
}

module.exports = { getFees, cashService };
