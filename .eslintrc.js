module.exports = {
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  ignorePatterns: ['.eslint.js'],
  parserOptions: {
    project: ['./jsconfig.json', './tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  extends: [
    //require.resolve('@umijs/fabric/dist/eslint'),
    'eslint:recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
  ],
  rules: {
    'react/function-component-definition': 0,
    'spaced-comment': 0,
    'import/extensions': 0,
    'react/react-in-jsx-scope': 0,
    'max-len': 0,
    'no-console': 2,
    'jsx-a11y/click-events-have-key-events': 0,
  },
};
