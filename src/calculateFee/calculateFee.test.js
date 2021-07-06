const {
  calculateNaturalCashOutFee,
  calculateCashIn,
  calculateJuridicalCashOutFee,
  calculateFee
} = require('./calculateFee');

describe('src', () => {
    describe('calculateFee', () => {
        test('calculateFee console error if argument is not array', () => {
            expect(calculateFee({})).toBe();
        });
        test('calculateFee console error if array is empty', () => {
            expect(calculateFee([])).toBe();
        });
        test('calculateFee returns correct fee for cash in', () => {
            expect(
                calculateFee([{
                        date: '2016-01-05',
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_in',
                        operation: { amount: 200.0, currency: 'EUR' })).toBe(0.06);
                });
        });
        test('calculateFee returns correct fee for natural cash out', () => {
            expect(
                calculateFee([{
                        date: '2016-01-05',
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: { amount: 200.0, currency: 'EUR' })).toBe(0);
                });
        });
        test('calculateFee returns correct fee for juridical cash out', () => {
            expect(
                calculateFee([{
                        date: '2016-01-06',
                        user_id: 2,
                        user_type: 'juridical',
                        type: 'cash_out',
                        operation: { amount: 300.0, currency: 'EUR' })).toBe(0.90);
                });
        });
    });

    describe('calculateNaturalCashOutFee', () => {
        test('cash out 300 EUR per week is free of charge', () => {
            const closure = calculateNaturalCashOutFee();
            expect(
                closure({
                        date: '2016-01-10',
                        user_id: 3,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: { amount: 300.0, currency: 'EUR' },
                    },
                    0.3,
                    1000
                )
            ).toBe(0);
        });

        test('cash out 1000 EUR per week is free of charge', () => {
            const closure = calculateNaturalCashOutFee();
            expect(
                closure({
                        date: '2016-01-10',
                        user_id: 3,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: { amount: 700.0, currency: 'EUR' },
                    },
                    0.3,
                    1000
                )
            ).toBe(0);
        });

        test('cash out 1500 EUR per week is 1.5 EUR fee', () => {
            const closure = calculateNaturalCashOutFee();
            expect(
                closure({
                        date: '2016-01-10',
                        user_id: 1,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: { amount: 1500.0, currency: 'EUR' },
                    },
                    0.3,
                    1000
                )
            ).toBe(1.5);
        });

        test('cash out 1300 EUR is 0.9 EUR fee', () => {
            const closure = calculateNaturalCashOutFee();
            expect(
                closure({
                        date: '2017-01-10',
                        user_id: 3,
                        user_type: 'natural',
                        type: 'cash_out',
                        operation: { amount: 1300.0, currency: 'EUR' },
                    },
                    0.3,
                    1000
                )
            ).toBe(0.9);
        });
    });

    describe('calculateCashIn', () => {
        test('cash in 1000 EUR is 0.3 EUR fee', () => {
            expect(
                calculateCashIn({ date: '2016-01-05', user_id: 1, user_type: 'natural', type: 'cash_in', operation: { amount: 1000.0, currency: 'EUR' } },
                    0.03,
                    5
                )
            ).toBe(0.3);
        });

        test('cash in 100 EUR is 0.03 EUR fee', () => {
            expect(
                calculateCashIn({ date: '2016-01-05', user_id: 1, user_type: 'natural', type: 'cash_in', operation: { amount: 100.0, currency: 'EUR' } },
                    0.03,
                    5
                )
            ).toBe(0.03);
        });
    });

    describe('calculateJuridicalCashOutFee', () => {
        test('juridical cash out 1 EUR is 0.5 EUR fee', () => {
            expect(
                calculateJuridicalCashOutFee({
                        date: '2016-02-15',
                        user_id: 1,
                        user_type: 'najuridicaltural',
                        type: 'cash_out',
                        operation: { amount: 1.0, currency: 'EUR' },
                    },
                    0.3,
                    0.5
                )
            ).toBe(0.5);
        });

        test('juridical cash out 10 EUR is 0.5 EUR fee', () => {
            expect(
                calculateJuridicalCashOutFee({
                        date: '2016-02-15',
                        user_id: 1,
                        user_type: 'najuridicaltural',
                        type: 'cash_out',
                        operation: { amount: 10.0, currency: 'EUR' },
                    },
                    0.3,
                    0.5
                )
            ).toBe(0.5);
        });
    });
});
