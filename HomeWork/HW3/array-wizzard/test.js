import { sum, unique, chunk } from "../array-wizzard/index.js";

const arr = [1, 2, 2, 3, 4];

console.log(sum(arr)); // 12
console.log(unique(arr)); // [1, 2, 3, 4]
console.log(chunk(arr, 2)); // [[1, 2], [2, 3], [4]]
