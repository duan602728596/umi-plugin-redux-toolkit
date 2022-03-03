export default {
  moduleNameMapper: {
    '\\./options$': '<rootDir>/test/template/options.js'
  },
  transform: {
    '\\.[jt]sx?$': ['babel-jest', {
      presets: [['@sweet-milktea/babel-preset-sweet', {
        env: {
          ecmascript: true,
          modules: 'commonjs'
        },
        typescript: {
          use: true
        }
      }]]
    }]
  }
};