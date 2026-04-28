import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'

const jsFiles = ['**/*.{js,mjs,cjs}']
const vueFiles = ['**/*.vue']

export default [
  {
    ...js.configs.recommended,
    files: jsFiles
  },
  {
    files: jsFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  // Service Worker specific config
  {
    files: ['**/sw.js', '**/service-worker.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_|^e$' }]
    }
  },
  // Vue files configuration
  ...pluginVue.configs['flat/recommended'].map(config => ({
    ...config,
    files: vueFiles
  })),
  {
    files: vueFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn'
    }
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/space-before-function-paren': ['error', 'always']
    }
  },
  {
    ignores: ['node_modules/**', 'dist/**', '**/*.html']
  }
]
