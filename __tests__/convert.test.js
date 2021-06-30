const {
    checkSameWeek,
    roundFeeToEURCents,
    numberToFloat,
    countNaturalWeekCashOutFee,
    calculateCashIn,
    calculateJuridicalCashOutFee,
} = require("./../src/convert");

test("'2021-06-28' and '2021-06-30' in the same week", () => {
    expect(checkSameWeek("2021-06-28", "2021-06-30")).toBeTruthy();
});

test("'2021-06-27' and '2021-06-28' are not in the same week", () => {
    expect(checkSameWeek("2021-06-27", "2021-06-28")).toBeFalsy();
});

test("one not correct date return false", () => {
    expect(checkSameWeek("2021-16-27", "2021-06-28")).toBeFalsy();
});

test("both not correct dates return false", () => {
    expect(checkSameWeek("2021-16-27", "2021-06-40")).toBeFalsy();
});

test("0.023 turns to 3", () => {
    expect(roundFeeToEURCents(0.023)).toBe(3);
});

test("0.020 turns to 2", () => {
    expect(roundFeeToEURCents(0.02)).toBe(2);
});

test("0.02345 turns to 3", () => {
    expect(roundFeeToEURCents(0.02345)).toBe(3);
});

test("0.001 turns to 1", () => {
    expect(roundFeeToEURCents(0.001)).toBe(1);
});

test("1 turns to '1.00'", () => {
    expect(numberToFloat(1)).toBe("1.00");
});

test("0.5 turns to '0.50'", () => {
    expect(numberToFloat(0.5)).toBe("0.50");
});

test("300 EUR per week is free of charge", () => {
    expect(
        countNaturalWeekCashOutFee({
            date: "2016-01-10",
            user_id: 3,
            user_type: "natural",
            type: "cash_out",
            operation: { amount: 300.0, currency: "EUR" },
        })
    ).toBe(0);
});

test("1000 EUR per week is free of charge", () => {
    expect(
        countNaturalWeekCashOutFee({
            date: "2016-01-10",
            user_id: 3,
            user_type: "natural",
            type: "cash_out",
            operation: { amount: 700.0, currency: "EUR" },
        })
    ).toBe(0);
});

test("1500 EUR per week is 150 EUR fee", () => {
    expect(
        countNaturalWeekCashOutFee({
            date: "2016-01-10",
            user_id: 3,
            user_type: "natural",
            type: "cash_out",
            operation: { amount: 500.0, currency: "EUR" },
        })
    ).toBe(150);
});

test("1300 EUR is 90 EUR fee", () => {
    expect(
        countNaturalWeekCashOutFee({
            date: "2017-01-10",
            user_id: 3,
            user_type: "natural",
            type: "cash_out",
            operation: { amount: 1300.0, currency: "EUR" },
        })
    ).toBe(90);
});

test("cash in 1000 EUR is 5 EUR fee", () => {
    expect(
        calculateCashIn({ date: "2016-01-05", user_id: 1, user_type: "natural", type: "cash_in", operation: { amount: 1000.0, currency: "EUR" } })
    ).toBe(5);
});

test("cash in 100 EUR is 3 EUR fee", () => {
    expect(
        calculateCashIn({ date: "2016-01-05", user_id: 1, user_type: "natural", type: "cash_in", operation: { amount: 100.0, currency: "EUR" } })
    ).toBe(3);
});

test("juridical cash out 1 EUR is 0.3 EUR fee", () => {
    expect(
        calculateJuridicalCashOutFee({
            date: "2016-02-15",
            user_id: 1,
            user_type: "najuridicaltural",
            type: "cash_out",
            operation: { amount: 1.0, currency: "EUR" },
        })
    ).toBe(0.3);
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