module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': [0, 'error', 'window'],
    'no-underscore-dangle': 'off',
    'arrow-parens': 'off',
    'max-len': ['error', { code: 160 }],
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    "import/extensions":  ['error', 'always', {
      'js': 'never',
      'vue': 'ignorePackages'
    }]
  },
};
