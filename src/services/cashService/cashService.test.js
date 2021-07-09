const { fetchData } = require('../../utils/fetchData/fetchData');
const { cashService } = require('./cashService');

jest.mock('../../utils/fetchData/fetchData');

describe('cashService', () => {
  describe('fetchCashIn', () => {
    test('should return fetchData response', () => {
      fetchData.mockImplementation(() => ({ key: 'key ' }));

      expect(cashService().fetchCashIn()).toEqual({ key: 'key ' });
    });
  });
  describe('fetchCashOutNatural', () => {
    test('should return fetchData response', () => {
      fetchData.mockImplementation(() => ({ key: 'key ' }));

      expect(cashService().fetchCashOutNatural()).toEqual({ key: 'key ' });
    });
  });
  describe('fetchCashOutJuridical', () => {
    test('should return fetchData response', () => {
      fetchData.mockImplementation(() => ({ key: 'key ' }));

      expect(cashService().fetchCashOutJuridical()).toEqual({ key: 'key ' });
    });
  });
});
