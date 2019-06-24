module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    semi: [2, 'never'],
    quotes: ['error', 'single'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'vue/no-dupe-keys': ['warn'],
    'vue/require-default-prop': ['off']
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  }
}
