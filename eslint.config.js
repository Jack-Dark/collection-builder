//  @ts-check
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import pluginPerfectionist from 'eslint-plugin-perfectionist';
import pluginReact from 'eslint-plugin-react';
import { tanstackConfig } from '@tanstack/eslint-config';
import globals from 'globals';

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
    // REACT PLUGIN UPDATES ONLY
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'react/jsx-no-useless-fragment': [
        'warn',
        {
          allowEmptyFragment: false,
          allowExpressions: true,
        },
      ],
      'react/jsx-curly-brace-presence': [
        'warn',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always',
        },
      ],
    },
    // Workaround for eslint-plugin-react incompatibility with ESLint v10.
    // eslint-plugin-react calls the removed context.getFilename() API for React
    // version auto-detection. Explicitly setting the version bypasses that.
    // Track: https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
    settings: {
      react: { version: '19' },
    },
  },
  {
    // @STYLISTIC PLUGIN UPDATES ONLY
    plugins: {
      '@stylistic': pluginStylistic,
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
    // UNUSED IMPORTS PLUGIN UPDATES ONLY
    plugins: {
      'unused-imports': pluginUnusedImports,
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
    // PERFECTIONIST PLUGIN UPDATES ONLY
    plugins: {
      perfectionist: pluginPerfectionist,
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
