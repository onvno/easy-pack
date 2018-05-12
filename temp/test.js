const merge = require('webpack-merge');

const a = {entry: ['a', 'b']};
const b = {entry: ['a', 'b', 'c']};
const c = merge(a, b);
console.log(c);