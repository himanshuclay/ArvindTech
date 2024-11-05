module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true, // If you're using Node.js as well
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended', // Added to support React rules
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
  },
  plugins: ['react', 'react-refresh'], // Added react plugin
  rules: {
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/jsx-props-no-spreading': 'off', // This should allow prop spreading
    'react/prop-types': 'off', // Ignore prop types
    'no-console': 'warn', // Example: Warn on console statements
  },
  overrides: [
    {
      files: ['**/*.cjs'],
      env: {
        node: true,
      },
    },
  ],
  settings: {
    react: {
      version: 'detect', // Automatically picks the version you have installed
    },
  },
};
