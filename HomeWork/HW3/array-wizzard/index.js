export function sum(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}

export function average(arr) {
  return sum(arr) / arr.length;
}

export function unique(arr) {
  return [...new Set(arr)];
}

export function groupBy(arr, fn) {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function flatten(arr) {
  return arr.flat(Infinity);
}

export function countBy(arr, fn) {
  return arr.reduce((acc, val) => {
    const key = fn(val);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export function removeFalsy(arr) {
  return arr.filter(Boolean);
}

export function max(arr) {
  return Math.max(...arr);
}

export function min(arr) {
  return Math.min(...arr);
}
