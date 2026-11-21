import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const eslintConfig = defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  globalIgnores([
    '.output/**',
    '.nitro/**',
    '.tanstack/**',
    'dist/**',
    'build/**',
    'src/routeTree.gen.ts',
    'components/commit.tsx',
  ]),
])

export default eslintConfig
