require('dotenv').config();
const { fetchData } = require('./fetchData');

describe('utils', () => {
  describe('fetchData', () => {
    test('fetchData returns object', async () => {
      const obj = { max: { amount: 5, currency: 'EUR' }, percents: 0.03 };
      await expect(fetchData('cash-in')).resolves.toStrictEqual(obj);
    });
    test('fetchData console error if wrong endpoint', async () => {
      await expect(fetchData('wrong')).resolves.toBe();
    });
  });
});
