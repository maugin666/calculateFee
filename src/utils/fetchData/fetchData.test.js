require('dotenv').config();
const { fetchData } = require('./fetchData');

describe('fetchData', () => {
  test('fetchData returns object', () => {
    const obj = { max: { amount: 5, currency: 'EUR' }, percents: 0.03 };
    expect(fetchData('cash-in')).resolves.toStrictEqual(obj);
  });
  test('fetchData throws error if wrong endpoint', () => {
    expect(fetchData('cash-i')).rejects.toThrow(Error);
  });
});
