const { roundFee, countNaturalWeekCashOutFee, calculateCashIn, calculateJuridicalCashOutFee } = require("./../src/convert");
const { checkSameWeek, numberToFloat } = require("./../src/utils/utils");

test("'2021-06-28' and '2021-06-30' in the same week", () => {
    expect(checkSameWeek("2021-06-28", "2021-06-30")).toBeTruthy();
});

test("'2021-06-27' and '2021-06-28' are not in the same week", () => {
    expect(checkSameWeek("2021-06-27", "2021-06-28")).toBeFalsy();
});

test("one not correct date throws error", () => {
    expect(() => checkSameWeek("2021-99-99", "2021-06-28")).toThrow(Error);
    expect(() => checkSameWeek("2021-99-99", "2021-06-28")).toThrow("Wrond date format.");
});

test("both not correct dates throws error", () => {
    expect(() => checkSameWeek("2021-16-88", "0000-99-40")).toThrow(Error);
    expect(() => checkSameWeek("2021-16-88", "0000-99-40")).toThrow("Wrond date format.");
});

test("0.023 turns to 0.03", () => {
    expect(roundFee(0.023)).toBe(0.03);
});

test("0.020 turns to 0.02", () => {
    expect(roundFee(0.02)).toBe(0.02);
});

test("0.02345 turns to 0.03", () => {
    expect(roundFee(0.02345)).toBe(0.03);
});

test("0.001 turns to 0.01", () => {
    expect(roundFee(0.001)).toBe(0.01);
});

test("1 turns to '1.00'", () => {
    expect(numberToFloat(1)).toBe("1.00");
});

test("0.5 turns to '0.50'", () => {
    expect(numberToFloat(0.5)).toBe("0.50");
});

test("cash out 300 EUR per week is free of charge", () => {
    const closure = countNaturalWeekCashOutFee();
    expect(
        closure({
            date: "2016-01-10",
            user_id: 3,
            user_type: "natural",
            type: "cash_out",
            operation: { amount: 300.0, currency: "EUR" },
        })
    ).toBe(0);
});

test("cash out 1000 EUR per week is free of charge", () => {
    const closure = countNaturalWeekCashOutFee();
    expect(
        closure({
            date: "2016-01-10",
            user_id: 3,
            user_type: "natural",
            type: "cash_out",
            operation: { amount: 700.0, currency: "EUR" },
        })
    ).toBe(0);
});

test("cash out 1500 EUR per week is 1.5 EUR fee", () => {
    const closure = countNaturalWeekCashOutFee();
    expect(
        closure({
            date: "2016-01-10",
            user_id: 1,
            user_type: "natural",
            type: "cash_out",
            operation: { amount: 1500.0, currency: "EUR" },
        })
    ).toBe(1.5);
});

test("cash out 1300 EUR is 0.9 EUR fee", () => {
    const closure = countNaturalWeekCashOutFee();
    expect(
        closure({
            date: "2017-01-10",
            user_id: 3,
            user_type: "natural",
            type: "cash_out",
            operation: { amount: 1300.0, currency: "EUR" },
        })
    ).toBe(0.9);
});

test("cash in 1000 EUR is 0.3 EUR fee", () => {
    expect(
        calculateCashIn({ date: "2016-01-05", user_id: 1, user_type: "natural", type: "cash_in", operation: { amount: 1000.0, currency: "EUR" } })
    ).toBe(0.3);
});

test("cash in 100 EUR is 0.03 EUR fee", () => {
    expect(
        calculateCashIn({ date: "2016-01-05", user_id: 1, user_type: "natural", type: "cash_in", operation: { amount: 100.0, currency: "EUR" } })
    ).toBe(0.03);
});

test("juridical cash out 1 EUR is 0.5 EUR fee", () => {
    expect(
        calculateJuridicalCashOutFee({
            date: "2016-02-15",
            user_id: 1,
            user_type: "najuridicaltural",
            type: "cash_out",
            operation: { amount: 1.0, currency: "EUR" },
        })
    ).toBe(0.5);
});

test("juridical cash out 10 EUR is 0.5 EUR fee", () => {
    expect(
        calculateJuridicalCashOutFee({
            date: "2016-02-15",
            user_id: 1,
            user_type: "najuridicaltural",
            type: "cash_out",
            operation: { amount: 10.0, currency: "EUR" },
        })
    ).toBe(0.5);
});