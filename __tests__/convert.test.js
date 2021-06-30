const { checkSameWeek } = require("./../src/convert");

test("'2021-06-28' and '2021-06-30' in the same week", () => {
    expect(checkSameWeek("2021-06-28", "2021-06-30")).toBe(true);
});