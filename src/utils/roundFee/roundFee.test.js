const { roundFee } = require('./roundFee');

describe('utils', () => {
  describe('roundFee', () => {
    test('0.023 turns to 0.03', () => {
      expect(roundFee(0.023)).toBe(0.03);
    });

    test('0.020 turns to 0.02', () => {
      expect(roundFee(0.02)).toBe(0.02);
    });

    test('0.02345 turns to 0.03', () => {
      expect(roundFee(0.02345)).toBe(0.03);
    });

    test('0.001 turns to 0.01', () => {
      expect(roundFee(0.001)).toBe(0.01);
    });
  });
});
