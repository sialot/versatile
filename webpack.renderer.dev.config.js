// 渲染进程prod环境webpack配置
const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成index.html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 文本分离插件，分离js和css
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理垃圾文件
const {spawn} = require('child_process');

const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

const { VueLoaderPlugin } = require('vue-loader'); // vue加载器
const port = 9999;
const isProd = process.env.NODE_ENV === 'production';

const publicPath = `http://localhost:${port}/dist/renderer/`;

const cssConfig = [
  isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
  {
      loader: 'css-loader',
      options: {
          sourceMap: !isProd
      }
  }
];

module.exports = merge(webpackBaseConfig, {
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: port,
    host: '0.0.0.0', // 设置值：0.0.0.0的好处，可以通过localhost访问，也可以通过127.0.0.1访问，还可以通过本机的ip进行访问
    overlay: {
        errors: true // 如果在webpack编译的过程中有任何的错误直接输出到页面上
    },
    hot:true, // 开启模块热替换
    headers: {'Access-Control-Allow-Origin': '*'},    
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,  //文件变动后多久发起构建，越大越好
        poll: 1000,  //每秒询问次数，越小越好
    },
    before() {
      // 启动渲染进程后执行主进程打包
      console.log('start main process...');
      spawn('npm', ['run', 'dev-main'], { // 相当于命令行执行npm run dev-main
        shell: true,
        env: process.env,
        stdio: 'inherit'
      }).on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
    }
  },
  entry: {
    index: './src/renderer/app.ts' // 入口文件
  }, 
  mode: 'development',
  target: 'web',   
  output: { publicPath, filename: '[name].dev.js' },
  module: { 
    rules: [ 

      {
        test: /\.vue$/,
        use: [
            {
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: cssConfig
                    },
                    preserveWhitespace: false // 不要留空白
                }
            }
        ],
        include: [resolve(__dirname, 'src')]
      },

      // 处理全局css样式
      { 
        test: /\.global\.css$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {sourceMap: true}
          },
          {loader: 'resolve-url-loader'},
        ]
      },
      // 处理css样式，使用css模块
      { 
        test: /^((?!\.global).)*\.css$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[name]__[local]__[hash:base64:5]' },
              sourceMap: true,
              importLoaders: 1
            }
          },
          {loader: 'resolve-url-loader'}
        ]
      },
      // 处理全局scss样式
      {
        test: /\.global\.(scss|sass)$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {sourceMap: true}
          },
          {loader: 'resolve-url-loader'},
          {loader: 'sass-loader'}
        ]
      },
      // 处理scss样式，使用css模块
      {
        test: /^((?!\.global).)*\.(scss|sass)$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[name]__[local]__[hash:base64:5]' },
              sourceMap: true,
              importLoaders: 1
            }
          },
          {loader: 'resolve-url-loader'},
          {loader: 'sass-loader'}
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
      NODE_ENV: 'development'
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src/renderer/template.html'), // 引入模版
      filename: 'index.html',
      minify: { // 对index.html压缩
          collapseWhitespace: false, // 去掉index.html的空格
          removeAttributeQuotes: false // 去掉引号
      },
      hash: true, // 去掉上次浏览器的缓存（使浏览器每次获取到的是最新的html）
      inlineSource: '.(js|css)'
    }),
    new webpack.HotModuleReplacementPlugin(), // 模块热替换
    new webpack.NoEmitOnErrorsPlugin() // 减少不需要的信息展示
  ]
});
