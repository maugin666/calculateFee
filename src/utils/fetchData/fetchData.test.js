const fetch = require('node-fetch-cache');
const { fetchData } = require('./fetchData');

jest.mock('node-fetch-cache');

describe('fetchData', () => {
  test('fetchData returns object', () => {
    fetch.mockImplementation(() => ({
      max: {
        amount: 5,
        currency: 'EUR',
      },
      percents: 0.03,
    }));
    const obj = { max: { amount: 5, currency: 'EUR' }, percents: 0.03 };
    expect(fetchData('cash-in')).resolves.toStrictEqual(obj);
  });
  test('fetchData throws error if wrong endpoint', async () => {
    fetch.mockImplementation(() => new Error());

    try {
      await fetchData();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
