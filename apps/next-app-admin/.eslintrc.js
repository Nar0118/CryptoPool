module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@nrwl/nx/react',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    '../../.eslintrc.js',
    'airbnb',
    'next/core-web-vitals',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'import/extensions': 0,
    'import/prefer-default-export': 2,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    semi: 0,
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    'arrow-body-style': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
        message: 'Unexpected property on console object was called',
      },
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-useless-catch': 0,
    'no-debugger': 1,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'eol-last': 2,
  },
  globals: {
    React: true,
    google: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true,
  },
};