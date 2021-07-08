const { checkSameWeek } = require('./checkSameWeek');

describe('checkSameWeek', () => {
  test('"2021-06-28" and "2021-06-30" in the same week', () => {
    expect(checkSameWeek('2021-06-28', '2021-06-30')).toBeTruthy();
  });

  test('"2021-06-27" and "2021-06-28" are not in the same week', () => {
    expect(checkSameWeek('2021-06-27', '2021-06-28')).toBeFalsy();
  });

  test('one not correct date throws error', () => {
    expect(() => checkSameWeek('2021-99-99', '2021-06-28')).toThrow(Error);
  });

  test('both not correct dates throws error', () => {
    expect(() => checkSameWeek('2021-99-99', '2021-99-99')).toThrow(Error);
  });
});
