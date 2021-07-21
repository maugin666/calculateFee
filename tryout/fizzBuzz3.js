const N = 100;
const arr = Array.from(Array(N), (_, index) => index + 1);

function mockAPI(number) {
  const nums = [5, 10, 99];
  return new Promise((response, reject) => {
    response({ in_table: nums.some((el) => el === number) });
  });
}

async function fizzBuzzAsync(nums) {
  try {
    return Promise.all(nums
      .map(async (num) => {
        const response = await mockAPI(num);
        if (response.in_table && (num >= 3 && num <= 6)) {
          return 'FizzBuzz';
        }
        if (response.in_table) {
          return 'Fizz';
        }
        if (num >= 3 && num <= 6) {
          return 'Buzz';
        }
        return num;
      }));
  } catch (err) {
    console.log(err);
  }
}
(async function () {
  const output = await fizzBuzzAsync(arr);
  console.log(output);
})();

