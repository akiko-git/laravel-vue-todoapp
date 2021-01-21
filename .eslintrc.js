'use strict';

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier/vue',
  ],
  globals: {
    axios: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2015,
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: ['vue'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  },
};
