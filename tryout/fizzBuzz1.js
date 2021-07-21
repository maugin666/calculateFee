function fizzBuzz(nums, parameter) {
  const store = {
    "FizzBuzz": {
      num1: 3,
      num2: 5,
      output1: 'Fizz',
      output2: 'Buzz',
    },
    "BarBaz": {
      num1: 7,
      num2: 11,
      output1: 'Bar',
      output2: 'Baz',
    },
    "FizzBuzz with different logic": {
      num1: 3,
      num2: 6,
      num3: 5,
      output1: 'Fizz',
      output2: 'Buzz',
    },
  };
  const setting = store[parameter];
  const conditions = {
    "FizzBuzz": {
      condition1: (num) => num % setting.num1 === 0,
      condition2: (num) => num % setting.num2 === 0,
    },
    "BarBaz": {
      condition1: (num) => num % setting.num1 === 0,
      condition2: (num) => num % setting.num2 === 0,
    },
    "FizzBuzz with different logic": {
      condition1: (num) => num >= setting.num1 && num <= setting.num2,
      condition2: (num) => num.toString().lastIndexOf(`${setting.num3}`) >= 0,
    },
  };

  console.log(`${parameter}: `);
  return checkConditions(nums, setting, conditions[parameter]);
}

function checkConditions(nums, setting, { condition1, condition2 }) {
  return nums
    .map((num) => {
      if (condition1(num) && condition2(num)) {
        return `${setting.output1}${setting.output2}`;
      }
      if (condition1(num)) {
        return setting.output1;
      }
      if (condition2(num)) {
        return setting.output2;
      }
      return num;
    });
}

// const N = 100;
// const arr = Array.from(Array(N), (_, index) => index + 1);
//
// console.log(fizzBuzz(arr, "FizzBuzz").join(' '));

module.exports = { fizzBuzz };
