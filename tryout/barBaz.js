const { fizzBuzz } = require('./fizzBuzz1.js');

const N = 100;
const arr = Array.from(Array(N), (_, index) => index + 1);

console.log(fizzBuzz(arr, "FizzBuzz").join(' '));
console.log(fizzBuzz(arr, "BarBaz").join(' '));
