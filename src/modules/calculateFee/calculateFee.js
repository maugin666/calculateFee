const { checkSameWeek } = require('../../utils/checkSameWeek/checkSameWeek');
const { roundNumber } = require('../../utils/roundNumber/roundNumber');
const { roundFee } = require('../../utils/roundFee/roundFee');
const { getFees } = require('../../api/getFees/getFees');
const {
  cashIn, cashOut, natural, juridical, currency,
} = require('../../constants/constants');

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
    const { user_id: userId, date, operation } = transaction;
    const { amount } = operation;
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
  const userType = transaction.user_type;

  if (userType === natural) {
    return countFee(transaction, cashOutNatural);
  }
  if (userType === juridical) {
    return calculateJuridicalCashOutFee(transaction, cashOutJuridical);
  }

  throw new Error('Wrong user type.');
}

function returnFee(transactions, { cashInFee, cashOutNatural, cashOutJuridical }, countFee) {
  if (!(transactions instanceof Array)) throw new Error('Wrong data.');
  if (transactions.length === 0) throw new Error('Empty array of transactions.');

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
async function prepareData(data) {
  const fees = await getFees();
  const countFee = calculateNaturalCashOutFee();

  returnFee(data, fees, countFee);
}

module.exports = {
  returnFee,
  roundFee,
  calculateNaturalCashOutFee,
  calculateCashIn,
  calculateJuridicalCashOutFee,
  prepareData,
};
