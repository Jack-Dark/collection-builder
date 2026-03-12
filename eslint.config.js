//  @ts-check
import stylistic from '@stylistic/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import perfectionist from 'eslint-plugin-perfectionist';
import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
  {
    rules: {
      'arrow-body-style': ['warn', 'always'],
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/arrow-parens': ['warn', 'always'],
      '@stylistic/padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      '@stylistic/jsx-self-closing-comp': [
        'warn',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    plugins: {
      perfectionist: perfectionist,
    },
    rules: {
      'jsx-sort-props': 'off',
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          type: 'natural',
        },
      ],
      'perfectionist/sort-imports': 'warn',
      'perfectionist/sort-objects': [
        'warn',
        {
          type: 'natural',
        },
      ],
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
];
