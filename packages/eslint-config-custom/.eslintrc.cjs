const { configure } = require('eslint-kit')

module.exports = configure({
  presets: [],
  extend: {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/return-await': 'off',
    },
  },
})
