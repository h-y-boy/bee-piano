import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  { languageOptions: { globals: globals.browser } },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    rules: {
      'prettier/prettier': 'warn',
      'vue/multi-word-component-names': 'off', // 根据需要调整
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-undef': 'off',
    },
  },
  {
    ignores: ['dist/', 'public/', 'node_modules/'],
  },
]
