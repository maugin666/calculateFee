const { fetchData } = require('../utils/fetchData/fetchData');

const cashService = () => ({
  fetchCashIn: () => fetchData('cash-in'),
  fetchCashOutNatural: () => fetchData('cash-out-natural'),
  fetchCashOutJuridical: () => fetchData('cash-out-juridical'),
});

async function getFees() {
  try {
    const cashInFee = await cashService().fetchCashIn();
    const cashOutNatural = await cashService().fetchCashOutNatural();
    const cashOutJuridical = await cashService().fetchCashOutJuridical();

    return {
      cashInFee,
      cashOutNatural,
      cashOutJuridical,
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { getFees };
