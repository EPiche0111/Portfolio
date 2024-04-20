module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-alert': 'off',
    'class-methods-use-this': 'off',
    'vue/no-multi-spaces': 'error',
    'vue/attribute-hyphenation': 'error',
    'vue/this-in-template': 'error',
    'vue/key-spacing': 'error',
    'vue/keyword-spacing': 'error',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/html-indent': 'error',
    'vue/html-quotes': 'error',
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',
    'vue/object-curly-spacing': 'error',
    'vue/script-indent': 'error',
    'vue/component-name-in-template-casing': 'error',
    'vue/comma-dangle': ['error', 'only-multiline'],
    'vue/component-definition-name-casing': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'vue/max-len': 'off',
    'linebreak-style': 'off',
  },
};