import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.ts'],
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '*.min.js',
      'package-lock.json',
    ],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      unicorn,
      prettier,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      'unicorn/no-array-callback-reference': 'error',
      'unicorn/no-null': 'error',
      'unicorn/number-literal-case': 'error',
      'unicorn/numeric-separators-style': 'error',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/prefer-query-selector': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            env: true,
            i: true,
            j: true,
            props: true,
            Props: true,
          },
        },
      ],
      'prettier/prettier': 'error',
    },
  },
];
