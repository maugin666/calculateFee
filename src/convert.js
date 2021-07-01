const moment = require("moment");

function calculateFee(transactions) {
  if (!(transactions instanceof Array)) throw new Error("Wrong data.");
  if (transactions.length === 0) throw new Error("Empty array of transactions.");

  let output;
  transactions.forEach((transaction) => {
    if (transaction.operation.currency !== "EUR") throw new Error("Only supported currency is EUR.");
    if (transaction.type === "cash_in") {
      output = calculateCashIn(transaction);
    } else if (transaction.type === "cash_out") {
      if (transaction.user_type === "natural") {
        output = countNaturalWeekCashOutFee(transaction);
      } else if (transaction.user_type === "juridical") {
        output = calculateJuridicalCashOutFee(transaction);
      } else {
        throw new Error("Wrong user type.");
      }
    } else {
      throw new Error("Wrong transaction type.");
    }

    console.log(numberToFloat(output < 1 ? roundFeeToEURCents(output) : output));
  });
}

function checkSameWeek(str1, str2) {
  const date1 = moment(str1, "YYYYMMDD");
  const date2 = moment(str2, "YYYYMMDD");

  if (isNaN(date1) || isNaN(date2)) throw new Error("Wrond date format. Must be 'Y-m-d'");

  return date1.isoWeek() === date2.isoWeek();
}

function roundFeeToEURCents(fee) {
  const convertToEuro = fee * 100;

  return Math.ceil(convertToEuro);
}

function numberToFloat(number) {
  return number.toFixed(2);
}

const cashOutUsers = [];

function countNaturalWeekCashOutFee(transaction) {
  const cashOutUser = cashOutUsers.find((user) => user.user_id === transaction.user_id && checkSameWeek(user.date, transaction.date));

  if (cashOutUser) {
    cashOutUser.amount += transaction.operation.amount;
    return cashOutUser.amount <= 1000 ? 0 : (cashOutUser.amount - 1000) * 0.3;
  }
  cashOutUsers.push({
    user_id: transaction.user_id,
    date: transaction.date,
    amount: transaction.operation.amount,
  });
  return transaction.operation.amount <= 1000 ? 0 : (transaction.operation.amount - 1000) * 0.3;
}

function calculateCashIn(transaction) {
  const fee = transaction.operation.amount * 0.03;
  return fee > 5 ? 5 : fee;
}

function calculateJuridicalCashOutFee(transaction) {
  const fee = transaction.operation.amount * 0.3;
  return fee > 0.5 ? 0.5 : fee;
}

module.exports = {
  calculateFee,
  checkSameWeek,
  roundFeeToEURCents,
  numberToFloat,
  countNaturalWeekCashOutFee,
  calculateCashIn,
  calculateJuridicalCashOutFee,
};
