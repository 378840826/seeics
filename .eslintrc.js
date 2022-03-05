module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    // eslint 官方推荐的规则
    'eslint:recommended',
    'plugin:vue/essential',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // switch 语句需要 default
    'default-case': 2,
    // return 后不适用 else
    'no-else-return': 2,
    'no-empty-function': 2,
    // 要声明全局变量需要明确声明
    'no-implicit-globals': 2,
    'no-lone-blocks': 2,
    'no-loop-func': 2,
    'no-script-url': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-unmodified-loop-condition': 2,
    'no-useless-return': 2,
    'yoda': 2,
    'handle-callback-err': 2,
    // 禁止使用 var
    'no-var': 2,
    // 使用 const 定义常量
    'prefer-const': 2,
    // 使用模版字符串
    'prefer-template': 2,
    // 缩进
    'indent': [2, 2],
    // 一行代码的最大长度
    'max-len': [
      2,
      {
        'code': 120,
        'comments': 150,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true,
      },
    ],
    // 不允许多个空格
    'no-multi-spaces': 2,
    // 浮点数写全
    'no-floating-decimal': 2,
    // 必须使用全等
    'eqeqeq': 2,
    // 必须使用花括号
    'curly': 2,
    // 数组空格一致
    'array-bracket-spacing': 2,
    // 花括号前后需要空格
    'block-spacing': [2, 'always'],
    // 大括号的位置一致
    'brace-style': 2,
    // 逗号空格统一
    'comma-spacing': 2,
    // 键值对的空格
    'key-spacing': 2,
    // 关键字前后的空格必须一致
    'keyword-spacing': 2,
    // 类成员之间要空行
    'lines-between-class-members': 2,
    // 回调函数最大嵌套
    'max-nested-callbacks': [2, { 'max': 4 }],
    // // 函数参数个数限制
    // 'max-params': [2, { 'max': 4 }],
    // // 构造函数首字母大写
    // 'new-cap': 2,
    // 最大连续空行 2
    'no-multiple-empty-lines': 2,
    // 禁止三元表达式嵌套
    'no-nested-ternary': 2,
    // 花括号中需要空格
    'object-curly-spacing': [2, 'always'],
    // 优先使用单引号
    'quotes': [
      2,
      'single',
      { 'avoidEscape': true, 'allowTemplateLiterals': true },
    ],
    // 使用分号
    'semi': [2, 'always'],
    // 操作符两边需要空格
    'space-infix-ops': 2,
    // 箭头函数箭头前后空格
    'arrow-spacing': 2,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}