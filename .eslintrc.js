module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  globals: {
    "globalMode": true
  },
  rules: {
    "no-plusplus": "off",
    "no-console": "off",
    "no-await-in-loop": "off",
    "max-len": "off",
  },
};
