const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const webpackBaseConfig = require('./webpack.base.config');

module.exports = merge(webpackBaseConfig, {
  mode: 'development', // 开发模式
  target: 'node',
  entry: path.join(__dirname, 'src/main/index.ts'),
  output: {
    path: path.join(__dirname, 'dist/main'),
    filename: 'main.dev.js' // 开发模式文件名为main.dev.js
  },
  externals: [nodeExternals()], // 排除Node模块
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  }
});