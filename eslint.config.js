const js = require('@eslint/js');
const reactHooks = require('eslint-plugin-react-hooks');
const react = require('eslint-plugin-react');
const reactRefresh = require('eslint-plugin-react-refresh');
const globals = require('globals');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  // JS 默认推荐规则
  js.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        // 如果不是必须依赖类型信息，可以移除 project 提升性能
        // project: './tsconfig.json',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': typescript,
    },
    rules: {
      // React 推荐
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...typescript.configs.recommended.rules,

      // React 相关
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript 相关
      'no-undef': 'off', // ✅ 必须关闭，否则 namespace 会报未定义
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-namespace': 'off', // ✅ 允许使用 namespace
      '@typescript-eslint/no-explicit-any': 'off',

      // 其他
      'no-console': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // 忽略目录
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
