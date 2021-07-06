const { getFees } = require('./operationFees');

describe('src', () => {
  describe('getFees', () => {
    test('getFees returns object', async () => {
      const obj = {
        cashInFee: 0.03,
        juridicalCashOutFee: 0.3,
        maxCashInFeeAmount: 5,
        minJuridicalCashOutFeeAmount: 0.5,
        naturalCashOutFee: 0.3,
        perWeekAmount: 1000,
      };
      await expect(getFees()).resolves.toStrictEqual(obj);
    });
    test('getFees console error any of endpoints breaks', async () => {
      await expect(getFees()).resolves.toBe();
    });
  });
});
