const { fetchData } = require('../utils/fetchData/fetchData');

async function getFees() {
  let cashInFee;
  let maxCashInFeeAmount;
  let naturalCashOutFee;
  let perWeekAmount;
  let juridicalCashOutFee;
  let minJuridicalCashOutFeeAmount;

  try {
    const cashIn = await fetchData('cash-in');
    cashInFee = cashIn.percents;
    maxCashInFeeAmount = cashIn.max.amount;

    const cashOutNatural = await fetchData('cash-out-natural');
    naturalCashOutFee = cashOutNatural.percents;
    perWeekAmount = cashOutNatural.week_limit.amount;

    const cashOutJuridical = await fetchData('cash-out-juridical');
    juridicalCashOutFee = cashOutJuridical.percents;
    minJuridicalCashOutFeeAmount = cashOutJuridical.min.amount;

    return {
      cashInFee,
      maxCashInFeeAmount,
      naturalCashOutFee,
      perWeekAmount,
      juridicalCashOutFee,
      minJuridicalCashOutFeeAmount,
    };
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getFees };
