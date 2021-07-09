const {
  calculateNaturalCashOutFee,
  calculateCashIn,
  calculateJuridicalCashOutFee,
  returnFee,
  prepareData,
} = require('./calculateFee');

describe('prepareData', () => {
  test('prepareData returns correct fee for cash in', async () => {
    console.log = jest.fn();
    await prepareData([
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 200.0,
          currency: 'EUR',
        },
      },
    ]);
    expect(console.log).toHaveBeenCalledWith('0.06');
  });
});

describe('returnFee', () => {
  const params = {
    cashInFee: { percents: 0.03, max: { amount: 5, currency: 'EUR' } },
    cashOutNatural: { percents: 0.3, week_limit: { amount: 1000, currency: 'EUR' } },
    cashOutJuridical: { percents: 0.3, min: { amount: 0.5, currency: 'EUR' } },
  };
  test('returnFee throws error if argument is not array', () => {
    expect(() => returnFee({}, params)).toThrow(Error);
  });
  test('returnFee throws error if array is empty', () => {
    expect(() => returnFee([], params)).toThrow(Error);
  });
  test('returnFee throws error if wrong currency', () => {
    expect(() => returnFee([
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 200.0,
          currency: 'RUB',
        },
      },
    ], params)).toThrow(Error);
  });
  test('returnFee throws error if wrong user type', () => {
    expect(() => returnFee([
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'tourist',
        type: 'cash_out',
        operation: {
          amount: 200.0,
          currency: 'EUR',
        },
      },
    ], params)).toThrow(Error);
  });
  test('returnFee throws error if wrong transaction type', () => {
    expect(() => returnFee([
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash',
        operation: {
          amount: 200.0,
          currency: 'EUR',
        },
      },
    ], params)).toThrow(Error);
  });
  test('returnFee returns correct small fee for cash in', () => {
    console.log = jest.fn();
    returnFee([
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 20.0,
          currency: 'EUR',
        },
      },
    ], params);
    expect(console.log).toHaveBeenCalledWith('0.01');
  });
  test('returnFee returns correct max fee for cash in', () => {
    console.log = jest.fn();
    returnFee([
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 20000.0,
          currency: 'EUR',
        },
      },
    ], params);
    expect(console.log).toHaveBeenCalledWith('5.00');
  });
  test('returnFee returns correct fee for cash in', () => {
    console.log = jest.fn();
    returnFee([
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 200.0,
          currency: 'EUR',
        },
      },
    ], params);
    expect(console.log).toHaveBeenCalledWith('0.06');
  });
  test('returnFee returns correct fee for natural cash out', () => {
    console.log = jest.fn();
    returnFee([
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
          amount: 200.0,
          currency: 'EUR',
        },
      },
    ], params, calculateNaturalCashOutFee());
    expect(console.log).toHaveBeenCalledWith('0.00');
  });
  test('returnFee returns correct fee for juridical cash out', () => {
    console.log = jest.fn();
    returnFee([
      {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: {
          amount: 300.0,
          currency: 'EUR',
        },
      },
    ], params);
    expect(console.log).toHaveBeenCalledWith('0.90');
  });
});

describe('calculateNaturalCashOutFee', () => {
  const params = { percents: 0.3, week_limit: { amount: 1000, currency: 'EUR' } };
  const closure = calculateNaturalCashOutFee();
  test('cash out 300 EUR per week is free of charge', () => {
    expect(closure(
      {
        date: '2016-01-10',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
          amount: 300.0,
          currency: 'EUR',
        },
      },
      params,
    ))
      .toBe(0);
  });

  test('cash out 1000 EUR per week is free of charge', () => {
    expect(closure(
      {
        date: '2016-01-10',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
          amount: 700.0,
          currency: 'EUR',
        },
      },
      params,
    ))
      .toBe(0);
  });

  test('cash out 1500 EUR per week is 4.5 EUR fee', () => {
    expect(closure(
      {
        date: '2016-01-10',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
          amount: 1500.0,
          currency: 'EUR',
        },
      },
      params,
    ))
      .toBe(4.5);
  });

  test('cash out 1300 EUR is 0.9 EUR fee', () => {
    expect(closure(
      {
        date: '2017-01-10',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
          amount: 1300.0,
          currency: 'EUR',
        },
      },
      params,
    ))
      .toBe(0.9);
  });
});

describe('calculateCashIn', () => {
  const params = { percents: 0.03, max: { amount: 5, currency: 'EUR' } };
  test('cash in 1000 EUR is 0.3 EUR fee', () => {
    expect(
      calculateCashIn({
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 1000.0,
          currency: 'EUR',
        },
      },
      params),
    )
      .toBe(0.3);
  });

  test('cash in 100 EUR is 0.03 EUR fee', () => {
    expect(
      calculateCashIn({
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 100.0,
          currency: 'EUR',
        },
      },
      params),
    )
      .toBe(0.03);
  });
});

describe('calculateJuridicalCashOutFee', () => {
  const params = { percents: 0.3, min: { amount: 0.5, currency: 'EUR' } };
  test('juridical cash out 1 EUR is 0.5 EUR fee', () => {
    expect(
      calculateJuridicalCashOutFee({
        date: '2016-02-15',
        user_id: 1,
        user_type: 'najuridicaltural',
        type: 'cash_out',
        operation: {
          amount: 1.0,
          currency: 'EUR',
        },
      },
      params),
    )
      .toBe(0.5);
  });

  test('juridical cash out 10 EUR is 0.5 EUR fee', () => {
    expect(calculateJuridicalCashOutFee({
      date: '2016-02-15',
      user_id: 1,
      user_type: 'najuridicaltural',
      type: 'cash_out',
      operation: {
        amount: 10.0,
        currency: 'EUR',
      },
    },
    params))
      .toBe(0.5);
  });
});
