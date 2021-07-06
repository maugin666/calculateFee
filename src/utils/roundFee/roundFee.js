function roundFee(fee) {
  return Math.ceil(fee * 100) / 100;
}

module.exports = { roundFee };
