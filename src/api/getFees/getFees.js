const { cashService } = require('../../services/cashService/cashService');

async function getFees() {
  const service = cashService();

  try {
    const cashInFee = await service.fetchCashIn();
    const cashOutNatural = await service.fetchCashOutNatural();
    const cashOutJuridical = await service.fetchCashOutJuridical();

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
