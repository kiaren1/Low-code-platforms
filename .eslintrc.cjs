// eslint-disable-next-line
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential"
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        ".eslintrc.{js,cjs}"
      ],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    requireConfigFile: false,
  },
  plugins: [
    "vue",
    "promise"
  ],
  globals: {
    "$to": "readonly",
  },
  rules: {
    "indent": ["error", 2],
    'vue/html-indent': ['error', 2],
    // html 需要有结束标签，除了自闭合标签
    'vue/html-end-tags': 2,
    // don't require .vue extension when importing
    "import/extensions": [
      "off",
      "always",
      {
        js: "never",
        vue: "never",
      },
    ],
    "no-await-in-loop": "warn",
    "no-duplicate-imports": "error",
    "no-new-native-nonconstructor": "error",
    "no-unreachable-loop": "error",
    "no-self-compare": "error",
    "no-template-curly-in-string": "error",
    "no-promise-executor-return": "error",
    "require-atomic-updates": "error",
    "max-nested-callbacks": ["error", 3], // 限制嵌套深度
    "no-return-await": "warn",
    "prefer-promise-reject-errors": "error",
    "camelcase": "warn", // 驼峰命名
    "consistent-return": "error",
    "curly": "warn",
    "eqeqeq": "error",
    "dot-notation": "warn",
    "init-declarations": ["error", "always"],
    "max-params": ["error", 5], // 最大参数不可超过5
    "new-cap": "error",
    "no-array-constructor": "error",
    "no-caller": "error",
    "no-confusing-arrow": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-floating-decimal": "error",
    "no-implicit-coercion": "error",
    "no-implied-eval": "error",
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-multi-assign": "error",
    "no-multi-str": "error",
    "no-nested-ternary": "error",
    "no-new": "error",
    "no-new-wrappers": "error",
    "no-param-reassign": "error",
    "no-proto": "error",
    "no-return-assign": "error",
    "no-shadow": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "prefer-const": "error",
    "require-await": "error",
    "spaced-comment": ["error", "always"],
    "yoda": "error",
    "arrow-parens": ["error", "always"],
    "arrow-spacing": "error",
    'no-async-promise-executor': 'error',
    "promise/catch-or-return": "error",
  }
}
