// 渲染进程prod环境webpack配置
const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成index.html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 文本分离插件，分离js和css
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理垃圾文件

const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

const { VueLoaderPlugin } = require('vue-loader'); // vue加载器
const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(webpackBaseConfig, {
  entry: {
    index: './src/renderer/app.ts' // 入口文件
  }, 
  mode: 'production',
  target: 'electron-renderer',  
  output: {
    path: resolve(__dirname, 'dist/renderer/'),
    filename: isProd ? 'javascript/[name].[contenthash:5].js' : '[name].js', // [name] 是entry的key
    publicPath: isProd ? './' : '/'
  },
  module: { 
    rules: [ 

      {
        test: /\.vue$/,
        use: [
            {
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: MiniCssExtractPlugin.loader,
                        ts: 'ts-loader'
                    },
                    preserveWhitespace: false // 不要留空白
                }
            }
        ],
        include: [resolve(__dirname, 'src')]
      },

      // 处理全局.css文件
      {
        test: /\.global\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: './' }
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {loader: 'resolve-url-loader'}, // 解决样式文件中的相对路径问题
        ]
      },

      // 一般样式文件，使用css模块
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[name]__[local]__[hash:base64:5]' },
              sourceMap: true
            }
          },
          {loader: 'resolve-url-loader'},
        ]
      },

      // 处理scss全局样式
      {
        test: /\.global\.(scss|sass)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 }
          },
          {loader: 'resolve-url-loader'},
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },

      // 处理一般sass样式，依然使用css模块
      {
        test: /^((?!\.global).)*\.(scss|sass)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[name]__[local]__[hash:base64:5]' },
              importLoaders: 1,
              sourceMap: true
            }
          },
          {loader: 'resolve-url-loader'},
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },

      // 处理字体文件 WOFF
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/font-woff' }
        }
      },

      // 处理字体文件 WOFF2
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/font-woff' }
        }
      },

      // 处理字体文件 TTF
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {  limit: 10000, mimetype: 'application/octet-stream' }
        }
      },

      // 处理字体文件 EOT
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },

      // 处理svg文件 SVG
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'image/svg+xml' }
        }
      },

      // 处理图片
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: {
          loader: 'url-loader',
          options: { limit: 5000 }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(), // vue加载器
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new MiniCssExtractPlugin({ // 分离css
      filename: 'stylesheets/[name].[contenthash:5].css'
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src/renderer/template.html'), // 引入模版
      filename: 'index.html',
      minify: { // 对index.html压缩
          collapseWhitespace: isProd, // 去掉index.html的空格
          removeAttributeQuotes: isProd // 去掉引号
      },
      hash: true, // 去掉上次浏览器的缓存（使浏览器每次获取到的是最新的html）
      inlineSource: '.(js|css)'
    }),
    new CleanWebpackPlugin({
      verbose: true, // 打印被删除的文件
      protectWebpackAssets: false, // 允许删除cleanOnceBeforeBuildPatterns中的文件
      cleanOnceBeforeBuildPatterns: ['**/*', resolve(__dirname, 'dist/renderer')]
    })
  ]
});
