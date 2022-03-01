module.exports = {
  extends: ['eslint:recommended', 'plugin:jest/recommended'],
  env: {
    browser: false,
    commonjs: true,
    node: true,
    es2021: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 13,
  },
};
