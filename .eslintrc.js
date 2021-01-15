module.exports = {
  extends: [
    //'eslint:recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2015
  },
  env: {
    browser: true,
  },
  plugins: [
    'vue'
  ],
}