const { checkSameWeek, numberToFloat } = require("./utils/utils");

function calculateFee(transactions) {
    if (!(transactions instanceof Array)) throw new Error("Wrong data.");
    if (transactions.length === 0) throw new Error("Empty array of transactions.");
    const countFee = countNaturalWeekCashOutFee();
    let output;
    transactions.forEach((transaction) => {
        if (transaction.operation.currency !== "EUR") throw new Error("Only supported currency is EUR.");
        if (transaction.type === "cash_in") {
            output = calculateCashIn(transaction);
        } else if (transaction.type === "cash_out") {
            if (transaction.user_type === "natural") {
                output = countFee(transaction);
            } else if (transaction.user_type === "juridical") {
                output = calculateJuridicalCashOutFee(transaction);
            } else {
                throw new Error("Wrong user type.");
            }
        } else {
            throw new Error("Wrong transaction type.");
        }

        console.log(numberToFloat(output < 1 ? roundFee(output) : output));
    });
}

function roundFee(fee) {
    return Math.ceil(fee * 100) / 100;
}

function countNaturalWeekCashOutFee() {
    const cashOutUsers = [];

    return function(transaction) {
        const cashOutUser = cashOutUsers.find((user) => user.user_id === transaction.user_id && checkSameWeek(user.date, transaction.date));
        let totalAmount;

        if (cashOutUser) {
            cashOutUser.amount += transaction.operation.amount;
            if (cashOutUser.amount <= 1000) {
                return 0;
            }
            totalAmount = cashOutUser.amount - 1000;
            cashOutUser.amount = 1000;
            return (totalAmount * 0.3) / 100;
        }

        if (transaction.operation.amount <= 1000) {
            totalAmount = transaction.operation.amount;
        } else {
            totalAmount = 1000;
        }
        cashOutUsers.push({
            user_id: transaction.user_id,
            date: transaction.date,
            amount: totalAmount,
        });
        return transaction.operation.amount <= 1000 ? 0 : ((transaction.operation.amount - 1000) * 0.3) / 100;
    };
}

function calculateCashIn(transaction) {
    const fee = (transaction.operation.amount * 0.03) / 100;
    return fee > 5 ? 5 : fee;
}

function calculateJuridicalCashOutFee(transaction) {
    const fee = (transaction.operation.amount * 0.3) / 100;
    return fee < 0.5 ? 0.5 : fee;
}

module.exports = {
    calculateFee,
    roundFee,
    countNaturalWeekCashOutFee,
    calculateCashIn,
    calculateJuridicalCashOutFee,
};