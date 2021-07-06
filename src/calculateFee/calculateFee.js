const { checkSameWeek } = require('../utils/checkSameWeek/checkSameWeek');
const { roundNumber } = require('../utils/roundNumber/roundNumber');
const { roundFee } = require('../utils/roundFee/roundFee');
const {
  cashIn, cashOut, natural, juridical, currency,
} = require('../constants');
const { getFees } = require('../operationFees/operationFees');

async function calculateFee(transactions) {
  if (!(transactions instanceof Array)) console.error('Wrong data.');
  if (transactions.length === 0) console.error('Empty array of transactions.');

  let cashInFee;
  let maxCashInFeeAmount;
  let naturalCashOutFee;
  let perWeekAmount;
  let juridicalCashOutFee;
  let minJuridicalCashOutFeeAmount;

  try {
    const data = await getFees();
    cashInFee = data.cashInFee;
    maxCashInFeeAmount = data.maxCashInFeeAmount;
    naturalCashOutFee = data.naturalCashOutFee;
    perWeekAmount = data.perWeekAmount;
    juridicalCashOutFee = data.juridicalCashOutFee;
    minJuridicalCashOutFeeAmount = data.minJuridicalCashOutFeeAmount;
  } catch (error) {
    console.error(error);
  }

  const countFee = calculateNaturalCashOutFee();
  let output;
  transactions.forEach((transaction) => {
    if (transaction.operation.currency !== currency) console.error(`Only supported currency is ${currency}.`);
    if (transaction.type === cashIn) {
      output = calculateCashIn(transaction, cashInFee, maxCashInFeeAmount);
    } else if (transaction.type === cashOut) {
      if (transaction.user_type === natural) {
        output = countFee(transaction, naturalCashOutFee, perWeekAmount);
      } else if (transaction.user_type === juridical) {
        output = calculateJuridicalCashOutFee(
          transaction,
          juridicalCashOutFee,
          minJuridicalCashOutFeeAmount
        );
      } else {
        console.error('Wrong user type.');
      }
    } else {
      console.error('Wrong transaction type.');
    }

    console.log(roundNumber(output < 1 ? roundFee(output) : output));
  });
}

function setUser(users, userId, date, amount) {
  users.push({
    user_id: userId,
    date,
    amount,
  });
}

function getUser(users, userId, date) {
  return users.find((user) => user.user_id === userId && checkSameWeek(user.date, date));
}

function updateUser(user, amount) {
  user.amount = amount;
}

function calculateNaturalCashOutFee() {
  const cashOutUsers = [];

  return function (transaction, naturalCashOutFee, perWeekAmount) {
    const userId = transaction.user_id;
    const { date } = transaction;
    const { amount } = transaction.operation;
    const cashOutUser = getUser(cashOutUsers, userId, date);
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
    setUser(cashOutUsers, userId, date, totalAmount);

    return amount <= perWeekAmount ? 0 : ((amount - perWeekAmount) * naturalCashOutFee) / 100;
  };
}

function calculateCashIn(transaction, cashInFee, maxCashInFeeAmount) {
  const fee = (transaction.operation.amount * cashInFee) / 100;
  return fee > maxCashInFeeAmount ? maxCashInFeeAmount : fee;
}

function calculateJuridicalCashOutFee(
  transaction,
  juridicalCashOutFee,
  minJuridicalCashOutFeeAmount
) {
  const fee = (transaction.operation.amount * juridicalCashOutFee) / 100;
  return fee < minJuridicalCashOutFeeAmount ? minJuridicalCashOutFeeAmount : fee;
}

module.exports = {
  calculateFee,
  roundFee,
  calculateNaturalCashOutFee,
  calculateCashIn,
  calculateJuridicalCashOutFee,
};
