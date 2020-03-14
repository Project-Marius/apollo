const path = require('path')

module.exports = {
  target: 'webworker',
  entry: './src/index.js',
  resolve: {
    extensions: [".ts", ".mjs", ".js"],
    alias: {
      fs: path.resolve(__dirname, 'null.js'),
    },
  },
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
}