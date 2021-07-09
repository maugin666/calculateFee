const { checkSameWeek } = require('../utils/checkSameWeek/checkSameWeek');
const { roundNumber } = require('../utils/roundNumber/roundNumber');
const { roundFee } = require('../utils/roundFee/roundFee');
const {
  cashIn, cashOut, natural, juridical, currency,
} = require('../constants');

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

function handleCashOut(transaction, { cashOutNatural, cashOutJuridical }, countFee) {
  if (transaction.user_type === natural) {
    return countFee(transaction, cashOutNatural);
  }
  if (transaction.user_type === juridical) {
    return calculateJuridicalCashOutFee(transaction, cashOutJuridical);
  }
  throw new Error('Wrong user type.');
}

async function returnFee(transactions, { cashInFee, cashOutNatural, cashOutJuridical }, countFee) {
  if (!(transactions instanceof Array)) return Promise.reject(new Error('Wrong data.'));
  if (transactions.length === 0) return Promise.reject(new Error('Empty array of transactions.'));

  transactions
    .map((transaction) => {
      if (transaction.operation.currency !== currency) {
        throw new Error(`Only supported currency is ${currency}.`);
      }
      if (transaction.type === cashIn) {
        return calculateCashIn(transaction, cashInFee);
      }
      if (transaction.type === cashOut) {
        return handleCashOut(transaction, { cashOutNatural, cashOutJuridical }, countFee);
      }
      throw new Error('Wrong transaction type.');
    })
    .forEach((output) => console.log(roundNumber(output < 1 ? roundFee(output) : output)));
}

module.exports = {
  returnFee,
  roundFee,
  calculateNaturalCashOutFee,
  calculateCashIn,
  calculateJuridicalCashOutFee,
};
