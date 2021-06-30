/*eslint no-commonjs: [2, { allowPrimitiveModules: true }]*/
const moment = require("moment");

function calculateFee(transactions) {
    let output;
    transactions.forEach((transaction) => {
        if (transaction.type === "cash_in") {
            output = calculateCashIn(transaction);
        } else if (transaction.type === "cash_out") {
            if (transaction.user_type === "natural") {
                output = countNaturalWeekCashOutFee(transaction);
            } else {
                output = calculateJuridicalCashOutFee(transaction);
            }
        }
        console.log(numberToFloat(output < 1 ? roundFeeToEURCents(output) : output));
    });
}

function checkSameWeek(date1, date2) {
    return moment(date1, "YYYYMMDD").isoWeek() === moment(date2, "YYYYMMDD").isoWeek();
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