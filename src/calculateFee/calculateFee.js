const { checkSameWeek } = require('../utils/checkSameWeek/checkSameWeek');
const { roundNumber } = require('../utils/roundNumber/roundNumber');
const { roundFee } = require('../utils/roundFee/roundFee');
const {
  cashIn, cashOut, natural, juridical, currency,
} = require('../constants');
const { getFees } = require('../operationFees/operationFees');

function calculateNaturalCashOutFee() {
  const cashOutUsers = [];
  const createUser = ({ userId, date, amount }) => {
    cashOutUsers.push({
      userId,
      date,
      amount,
    });
  };
  const getSameWeekUser = (userId, date) => cashOutUsers
    .find((user) => user.userId === userId && checkSameWeek(user.date, date));
  const updateUser = (user, amount) => {
    user.amount = amount;
  };

  return function countFee(transaction, cashOutNatural) {
    const naturalCashOutFee = cashOutNatural.percents;
    const perWeekAmount = cashOutNatural.week_limit.amount;
    const userId = transaction.user_id;
    const { date } = transaction;
    const { amount } = transaction.operation;
    const cashOutUser = getSameWeekUser(userId, date);
    let totalAmount;

    if (cashOutUser) {
      const newAmount = cashOutUser.amount + amount;
      updateUser(cashOutUser, newAmount);
      if (cashOutUser.amount <= perWeekAmount) {
        return 0;
      }
      totalAmount = cashOutUser.amount - perWeekAmount;
      updateUser(cashOutUser, perWeekAmount);
      return (totalAmount * naturalCashOutFee) / 100;
    }

    if (amount <= perWeekAmount) {
      totalAmount = amount;
    } else {
      totalAmount = perWeekAmount;
    }
    createUser({ userId, date, amount: totalAmount });

    return amount <= perWeekAmount ? 0 : ((amount - perWeekAmount) * naturalCashOutFee) / 100;
  };
}

function calculateCashIn(transaction, cashInFee) {
  const maxCashInFeeAmount = cashInFee.max.amount;
  const fee = (transaction.operation.amount * cashInFee.percents) / 100;

  return fee > maxCashInFeeAmount ? maxCashInFeeAmount : fee;
}

function calculateJuridicalCashOutFee(transaction, cashOutJuridical) {
  const minJuridicalCashOutFeeAmount = cashOutJuridical.min.amount;
  const fee = (transaction.operation.amount * cashOutJuridical.percents) / 100;

  return fee < minJuridicalCashOutFeeAmount ? minJuridicalCashOutFeeAmount : fee;
}

async function calculateFee(transactions) {
  if (!(transactions instanceof Array)) throw new Error('Wrong data.');
  if (transactions.length === 0) throw new Error('Empty array of transactions.');
  const { cashInFee, cashOutNatural, cashOutJuridical } = await getFees();
  const countFee = calculateNaturalCashOutFee();
  let output;

  transactions.forEach((transaction) => {
    if (transaction.operation.currency !== currency) {
      throw new Error(`Only supported currency is ${currency}.`);
    }
    if (transaction.type === cashIn) {
      output = calculateCashIn(transaction, cashInFee);
    } else if (transaction.type === cashOut) {
      if (transaction.user_type === natural) {
        output = countFee(transaction, cashOutNatural);
      } else if (transaction.user_type === juridical) {
        output = calculateJuridicalCashOutFee(transaction, cashOutJuridical);
      } else {
        throw new Error('Wrong user type.');
      }
    } else {
      throw new Error('Wrong transaction type.');
    }
    console.log(roundNumber(output < 1 ? roundFee(output) : output));
  });
}

module.exports = {
  calculateFee,
  roundFee,
  calculateNaturalCashOutFee,
  calculateCashIn,
  calculateJuridicalCashOutFee,
};
