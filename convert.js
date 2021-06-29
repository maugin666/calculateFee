
import moment from 'moment';

export default function calculateFee(transactions) {
  const cashOutUsers = [];
  let output;
  return transactions.map(el => {
    if (el.type === 'cash_in') {
      const fee = el.operation.amount * 0.03;
      output = fee > 5.00 ? 5.00 : fee;
    }
    if (el.type === 'cash_out') {
      if (el.user_type === 'natural') {
        const cashOutUser = cashOutUsers.find(user => user?.user_id === el.user_id && checkSameWeek(user?.date, el.date));
        if (cashOutUser) {
          cashOutUser.amount = cashOutUser.amount + el.operation.amount;
          output = cashOutUser.amount <= 1000.00 ? 0.00 : (cashOutUser.amount - 1000) * 0.3;
        } else {
          cashOutUsers.push({
            user_id: el.user_id,
            date: el.date,
            amount: el.operation.amount
          });
          output = el.operation.amount <= 1000.00 ? 0.00 : (el.operation.amount - 1000) * 0.3;
        }
      } else {
        const fee = el.operation.amount * 0.3;
        output = fee > 0.50 ? 0.50 : fee;
      }
    }
    console.log(output < 0 ? roundfee(output) : output.toFixed(2));
  })
}

function checkSameWeek(date1, date2) {
  return moment(date1, "YYYYMMDD").isoWeek() === moment(date2, "YYYYMMDD").isoWeek();
}

function roundfee(fee) {
  //0.023 -> 3.00
  const str = fee.toString();

  return parseFloat(str.length > 4 ? (str.slice(4, 5) > 0 ? +str.slice(0, 4) + 0.01 : str.slice(0, 4)) : str) * 100;
}
