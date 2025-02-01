const path = require('path');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = {
  entry: './app/src/index.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'app'),
  },
  plugins: [
    new CleanTerminalPlugin(),
  ],
};
