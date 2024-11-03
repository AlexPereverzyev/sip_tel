import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    rules: {
      quotes: ['error', 'single'],
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          exports: 'always-multiline',
          imports: 'always-multiline',
          functions: 'never',
        },
      ],
      'max-len': [
        'error',
        {
          code: 120,
        },
      ],
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
          ignoreComments: true,
        },
      ],
      '@typescript-eslint/no-empty-function': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_$',
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'warn',
        {
          assertionStyle: 'angle-bracket',
        },
      ],
    },
  },
  {
    ignores: ['build'],
  }
);
