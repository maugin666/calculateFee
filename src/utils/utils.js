const isSameWeek = require("date-fns/isSameWeek");
const isValid = require("date-fns/isValid");

function numberToFloat(number) {
    return number.toFixed(2);
}

function checkSameWeek(str1, str2) {
    const date1 = new Date(str1);
    const date2 = new Date(str2);

    if (!isValid(date1) || !isValid(date2)) throw new Error("Wrond date format.");

    return isSameWeek(date1, date2, { weekStartsOn: 1 });
}

module.exports = {
    checkSameWeek,
    numberToFloat,
};