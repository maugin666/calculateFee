const { getFees } = require('./getFees');
const { cashService } = require('../../services/cashService/cashService');

jest.mock('../../services/cashService/cashService');

describe('getFees', () => {
  test('getFees returns correct data', async () => {
    cashService.mockImplementation(() => ({
      fetchCashIn: () => ({
        max: {
          amount: 5,
          currency: 'EUR',
        },
        percents: 0.03,
      }),
      fetchCashOutNatural: () => ({
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: 'EUR',
        },
      }),
      fetchCashOutJuridical: () => ({
        min: {
          amount: 0.5,
          currency: 'EUR',
        },
        percents: 0.3,
      }),
    }));
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
    cashService.mockImplementation(() => ({
      fetchCashIn: () => {
        throw new Error();
      },
    }));

    try {
      await getFees();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
