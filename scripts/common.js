const path = require('path')

module.exports = {
  entry: path.resolve('./', 'src/index.ts'),
  output: {
    path: path.resolve('./', 'build'),
    filename: 'snabbdom.js',
    library: 'snabbdom',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve('./', 'src'),
    },
    extensions: ['.ts', '.js', '.json'],
  },
}