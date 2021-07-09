const { cashService } = require('./cashService');

describe('cashService', () => {
  test('cashService returns object', () => {
    expect(cashService()).toBeTruthy();
  });
});
