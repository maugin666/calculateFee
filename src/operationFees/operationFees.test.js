const { getFees } = require('./operationFees');

describe('getFees', () => {
  test('getFees returns correct data', async () => {
    const obj = {
      cashInFee: {
        max: {
          amount: 5,
          currency: 'EUR',
        },
        percents: 0.03,
      },
      cashOutJuridical: {
        min: {
          amount: 0.5,
          currency: 'EUR',
        },
        percents: 0.3,
      },
      cashOutNatural: {
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: 'EUR',
        },
      },
    };
    await expect(getFees()).resolves.toStrictEqual(obj);
  });
  test('getFees throws error any of endpoints breaks', async () => {
    await expect(() => getFees()).rejects.toEqual(Error);
  });
});
