const { roundNumber } = require('./roundNumber');

describe('utils', () => {
  describe('roundNumber', () => {
    test('1 turns to "1.00"', () => {
      expect(roundNumber(1)).toBe('1.00');
    });

    test('0.5 turns to "0.50"', () => {
      expect(roundNumber(0.5)).toBe('0.50');
    });
  });
});
