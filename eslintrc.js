module.exports = {
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  env: {
    es6: true,
    node: true,
    mocha: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
      //[path.resolve('../../../my-resolver')]: { someConfig: value }
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:node/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],

  plugins: ['prettier', 'promise'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'prefer-template': ['error'],
    'template-curly-spacing': ['error', 'never'],
    'no-template-curly-in-string': ['error', 'never'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'no-restricted-syntax': [
      'error',

      'FunctionExpression',
      'WithStatement',
      "BinaryExpression[operator='in']",
    ],
    'no-restricted-properties': [
      'error',
      {
        property: '__defineGetter__',
      },
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
}
