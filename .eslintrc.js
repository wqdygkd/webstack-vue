module.exports = {
  extends: ['eslint-config-wqdy/configs/vue2-js'],
  rules: {
    'vue/multi-word-component-names': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 5 },
      multiline: { max: 1 }
    }],
    'unicorn/prefer-module': 0
  }
}
