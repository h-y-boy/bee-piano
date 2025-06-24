import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import vueConfigPrettier from '@vue/eslint-config-prettier'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig({ extends: ['recommendedTypeChecked'] }),
  prettier,
  {
    rules: {
      ...vueConfigPrettier.rules,
      'prettier/prettier': 'warn',
      'vue/multi-word-component-names': 'off', // 根据需要调整
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['dist/', 'public/'],
  },
]
