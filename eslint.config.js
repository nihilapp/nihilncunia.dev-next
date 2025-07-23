import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import htmlPlugin from 'eslint-plugin-html';
import importXPlugin from 'eslint-plugin-import-x';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 기본 추천 설정
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Stylistic 설정
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: true,
  }),

  // 기본 환경 설정
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        commonjs: true,
        node: true,
        es2021: true,
      },
    },
  },

  // 플러그인 설정
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'import-x': importXPlugin,
      'html': htmlPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@stylistic': stylistic,
    },
  },

  // React 설정
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // 모든 파일에 적용되는 규칙
  {
    files: [ '**/*.{js,jsx,ts,tsx}', ],
    rules: {
      // 일반 규칙
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-unexpected-multiline': 'off',
      'no-use-before-define': 'off',
      'spaced-comment': 'off',
      'function-call-argument-newline': [
        'error',
        'consistent',
      ],
      'function-paren-newline': [
        'error',
        'multiline',
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 0,
        },
      ],
      'no-irregular-whitespace': 'error',
      'no-param-reassign': 'off',
      'eol-last': [
        'warn',
        'always',
      ],
      'no-plusplus': 'off',
      'no-restricted-syntax': 'off',
      'array-callback-return': 'off',
      'consistent-return': 'off',
      'no-nested-ternary': 'off',
      'no-shadow': 'off',
      'linebreak-style': 'off',
      'prefer-const': 'off',
      'max-len': 'off',
      'no-else-return': 'off',
      'no-lonely-if': 'off',
      'global-require': 'off',
      'class-methods-use-this': 'off',
      'no-useless-constructor': 'off',
      'no-useless-return': 'off',
      'lines-between-class-members': 'off',
      'arrow-body-style': 'off',
      'no-empty-function': 'off',
      'camelcase': 'off',
      'no-empty-pattern': 'off',
      'no-underscore-dangle': 'off',

      // Stylistic 규칙
      '@stylistic/multiline-ternary': [
        'warn',
        'always',
      ],
      '@stylistic/arrow-parens': [
        'error',
        'always',
      ],
      '@stylistic/quotes': [
        'warn',
        'single',
        { allowTemplateLiterals: 'always', },
      ],
      '@stylistic/semi': [
        'error',
        'always',
      ],
      '@stylistic/array-bracket-spacing': [
        'warn',
        'always',
        {
          arraysInArrays: true,
          singleValue: true,
          objectsInArrays: true,
        },
      ],
      '@stylistic/object-curly-spacing': [
        'warn',
        'always',
      ],
      '@stylistic/object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            multiline: true,
            consistent: true,
          },
          ObjectPattern: {
            multiline: true,
            consistent: true,
          },
          ImportDeclaration: {
            multiline: true,
            consistent: true,
          },
          ExportDeclaration: {
            multiline: true,
            consistent: true,
          },
          TSTypeLiteral: {
            multiline: true,
            consistent: true,
          },
        },
      ],
      '@stylistic/comma-dangle': [
        'warn',
        {
          arrays: 'always',
          functions: 'never',
          objects: 'always',
          imports: 'never',
          exports: 'never',
        },
      ],
      '@stylistic/object-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: false, },
      ],
      '@stylistic/array-element-newline': [
        'error',
        { minItems: 2, },
      ],
      '@stylistic/array-bracket-newline': [
        'error',
        { minItems: 2, },
      ],
      '@stylistic/jsx-quotes': [
        'error',
        'prefer-single',
      ],
      '@stylistic/indent': [
        'error',
        2,
        {
          FunctionDeclaration: { parameters: 1, },
          FunctionExpression: { parameters: 1, },
          CallExpression: { arguments: 1, },
        },
      ],
      // import-x 규칙
      'import-x/extensions': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/no-dynamic-require': 'off',
      'import-x/prefer-default-export': 'off',
      'import-x/order': [
        'warn',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import-x/no-cycle': 'off',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': 'warn',

      // TypeScript 규칙
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
        },
      ],

      // React 규칙
      '@stylistic/indent': [
        'warn',
        2,
        {
          checkAttributes: true,
          indentLogicalExpressions: false,
        },
      ],
      '@stylistic/indent': [
        'warn',
        2,
      ],
      '@stylistic/jsx-curly-spacing': [
        'error',
        {
          when: 'never',
          children: true,
        },
      ],
      '@stylistic/jsx-closing-bracket-location': [
        'warn',
        'tag-aligned',
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/forbid-prop-types': 'off',
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: [
            'js',
            'jsx',
            '.ts',
            '.tsx',
          ],
        },
      ],
      'react/no-danger': 'off',
      '@stylistic/jsx-curly-brace-presence': [
        'warn',
        {
          props: 'never',
          children: 'never',
        },
      ],
      'react/require-default-props': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/no-arrow-function-lifecycle': 'off',
      'react/no-invalid-html-attribute': 'off',
      'react/no-unused-class-component-methods': 'off',
      'react/button-has-type': 'off',
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'css',
            'tw',
            'jsx',
            'global',
          ],
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // React Hooks 규칙
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 접근성 규칙
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: [ 'Link', ],
          specialLink: [
            'hrefLeft',
            'hrefRight',
          ],
          aspects: [
            'invalidHref',
            'preferButton',
          ],
        },
      ],
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
    },
  },

  // TypeScript 파일 전용 설정
  {
    files: [ '**/*.{ts,tsx}', ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
      'import-x/parsers': {
        '@typescript-eslint/parser': [
          '.ts',
          '.tsx',
        ],
      },
    },
    rules: {
      'import-x/named': 'error',
      'import-x/default': 'error',
      'import-x/namespace': 'error',
    },
  },

  // Next.js 특화 규칙
  {
    files: [ 'app/**/*.{js,jsx,ts,tsx}', ],
    rules: {
      'import-x/no-default-export': 'off',
      'react/function-component-definition': 'off',
    },
  },

  // 테스트 파일 규칙
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
    ],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },

  // 설정 파일들에 대한 예외
  {
    files: [
      '*.config.{js,ts}',
      '*.config.*.{js,ts}',
      'postcss.config.js',
    ],
    rules: {
      'import-x/no-default-export': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
    languageOptions: {
      env: {
        node: true,
      },
    },
  },

  // UI 컴포넌트 폴더 규칙 (선언 전 사용 허용)
  {
    files: [ 'app/_components/common/ui/**/*.tsx', ],
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
    },
  }
);
