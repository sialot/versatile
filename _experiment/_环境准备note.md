## 环境描述

windows7

nodejs v10.16.3

npm 6.11.3

electron@12.0.2

typescript@4.2.4

webpack-merge@5.7.3
webpack-cli@4.6.0
webpack@5.31.2

webpack-node-externals@2.5.2

ts-loader@8.1.0

sass-loader@11.0.1
style-loader@2.0.0
url-loader@4.1.1
resolve-url-loader@3.1.2
file-loader@6.2.0
css-loader@5.2.1

node-sass@5.0.0

 mini-css-extract-plugin@1.4.1
 html-webpack-plugin@5.3.1

vue@2.6.12

vue-loader@15.9.6

## 一、Electron安装

### 1、初始化项目

```shell
npm init
```

生成一个package.json



### 2、安装Electron

#### 文档

https://www.electronjs.org/docs

#### 安装命令

```shell
npm install electron --save-dev
```



#### 简介

Electron项目通常由主进程和渲染进程组成，主进程用于实现应用后端，一般会使用C++或rust实现核心功能并以Node插件的形式加载到主进程（比如字节跳动的飞书、飞聊的主进程则是使用rust实现），其中的JavaScript部分像一层胶水，用于连接Electron和第三方插件，渲染进程则是实现Web UI的绘制以及一些UI交互逻辑。主进程和渲染进程是独立开发的，进程间使用IPC进行通信，因此对主进程和渲染进程进行分开打包，也就是两套webpack配置，同时为区分开发环境和生产环境，也需要两套webpack配置。此外在开发electron应用时会有多窗口的需求，因此对渲染进程进行多页面打包，整体结构如下。

```
project
  |__src
     |__main                                          # 主进程代码 
        |__index.ts
        |__other
     |__renderer                                      # 渲染进程代码
        |__index                                      # 一个窗口/页面
           |__index.tsx
           |__index.scss
        |__other   
  |__dist                                             # webpack打包后产物
  |__native                                           # C++代码
  |__release                                          # electron-builder打包后产物
  |__resources                                        # 资源文件
  |__babel.config.js                                  # babel配置
  |__tsconfig.json                                    # typescript配置
  |__webpack.base.config.js                           # 基础webpack配置
  |__webpack.main.dev.js                              # 主进程开发模式webpack配置
  |__webpack.main.prod.js                             # 主进程生产模式webpack配置
  |__webpack.renderer.dev.js                          # 渲染进程开发模式webpack配置
  |__webpack.renderer.prod.js                         # 渲染进程生产模式webpack配置
```



## 二、安装 typescript

### 1、安装命令

```bash
npm install --save-dev typescript
```

### 2、配置文件

新建文件 tsconfig.json

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "target": "ES2018",
    "module": "CommonJS",
    "lib": [
      "dom",
      "esnext"
    ],
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "pretty": true,
    "sourceMap": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "allowJs": true,
    "resolveJsonModule": true
  },
  "exclude": [
    "node_modules",
    "native",
    "resources"
  ],
  "include": [
    "src/main",
    "src/renderer"
  ]
}

```

### 3、配置文件详解

https://www.cnblogs.com/cczlovexw/p/11527708.html



## 三、WebPack安装

https://webpack.docschina.org/



### 1、WebPack项目打包流程示意图![img](https://user-gold-cdn.xitu.io/2020/7/2/1730d1b6e95392f7?w=1578&h=992&f=png&s=120682)

### 2、安装webpack

#### webpack本身

```bash
npm install --save-dev webpack webpack-cli webpack-merge
```

#### 安装webpack-node-externals

主进程打包时只需要将src/main下的所有ts文件打包到dist/main下，值得注意的是，主进程对应的是node工程，如果直接使用webpack进行打包会将node_modules中的模块也打包进去，所以这里使用webpack-node-externals插件去排除node_modules模块

```shell
npm install --save-dev webpack-node-externals
```

#### 为支持typescript，安装ts-loader

`css-loader`、`sass-loader`、`style-loader`处理样式，`url-loader`、`file-loader`处理图片和字体，[resolve-url-loader](https://www.npmjs.com/package/resolve-url-loader)处理scss文件`url()`中的相对路径问题

```shell
npm install ts-loader --save-dev
```

#### 配置基础配置文件

webpack.base.config.js

```javascript
const path = require('path');

// 基础的webpack配置
module.exports = {
  module: {
    rules: [   
         
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.ts'],
    alias: {
      '~native': path.resolve(__dirname, 'native'), // 别名，方便import
      '~resources': path.resolve(__dirname, 'resources') // 别名，方便import      
    }
  },
  devtool: 'source-map',
  plugins: []
};
```



## 四、主进程webpack打包配置

### 1、配置文件

开发模式下对应的webpack配置webpack.main.dev.config.js如下

```javascript
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
```


生产模式与开发模式类似，因此对应webpack配置的webpack.main.prod.config.js如下

```javascript
const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.main.dev.config');

module.exports = merge(webpackDevConfig, {
  mode: 'production', // 生产模式
  output: {
    path: path.join(__dirname, 'dist/main'),
    filename: 'main.prod.js' // 生产模式文件名为main.prod.js
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    })
  ]
});
```



### 2、添加运行命令

到此为止，已经完成了主进程的打包配置，这里可以直接测试项目生产环境的打包结果。

首先向package.json中添加相应的运行命令，build-main打包主进程

```
{
  ...
  "main": "dist/main/main.prod.js",
  "scripts": {
    "build-main": "cross-env NODE_ENV=production webpack --config webpack.main.prod.config.js"   
  },
  ...
}
```

在编写脚本中使用到了[cross-env](https://www.npmjs.com/package/cross-env)，顾名思义，提供跨平台的环境变量支持，而[concurrently](https://www.npmjs.com/package/concurrently)用于并行运行命令，安装如下

```bash
npm install --save-dev cross-env concurrently
```



### 3、测试

添加 src/index.ts

```typescript
import { BrowserWindow, app } from 'electron';
import path from "path";

// 加载html，目前只对生产模式进行加载
function loadHtml(window: BrowserWindow, name: string) {
  if (process.env.NODE_ENV === 'production') {
    window.loadFile(path.resolve(__dirname, `../renderer/${name}/index.html`)).catch(console.error);
    return;
  }
  // TODO development
}

let mainWindow: BrowserWindow | null = null;

// 创建窗口
function createMainWindow() {
  if (mainWindow) return;
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#252526',
    minWidth: 450,
    minHeight: 350,
    width: 450,
    height: 350
  });
  loadHtml(mainWindow, 'index');
  mainWindow.on('close', () => mainWindow = null);
  mainWindow.webContents.on('crashed', () => console.error('crash'));
}
app.on('ready', () => { createMainWindow() });
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => { createMainWindow() })
```

使用`build-main`命令并行打包主进程代码

```bash
npm run build-main
```



## 五、渲染进程webpack打包配置（静态HTML）



### 1、插件安装

先来看生产模式下的打包，安装相应的插件和loader，这里使用[html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)插件去生成html模版，而且需要对每一个页面生成一个.html文件

`css-loader`、`sass-loader`、`style-loader`处理样式，`url-loader`、`file-loader`处理图片和字体，[resolve-url-loader](https://www.npmjs.com/package/resolve-url-loader)处理scss文件`url()`中的相对路径问题

如果使用scss编写样式，所以需要安装`node-sass`包

```shell
npm install --save-dev css-loader file-loader sass-loader style-loader url-loader resolve-url-loader

npm install --save-dev node-sass

npm install --save-dev mini-css-extract-plugin html-webpack-plugin
```



### 2、配置文件

webpack.renderer.prod.config.js

```javascript
// 渲染进程prod环境webpack配置
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

const entry = {
  index: path.join(__dirname, 'src/renderer/index/index.ts'), // 页面入口
};
// 对每一个入口生成一个.html文件
const htmlWebpackPlugin = Object.keys(entry).map(name => new HtmlWebpackPlugin({
  inject: 'body',
  scriptLoading: 'defer',
  template: path.join(__dirname, 'resources/template/template.html'), // template.html是一个很简单的html模版
  minify: false,
  filename: `${name}/index.html`,
  chunks: [name]
}));

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  target: 'electron-preload',
  entry,
  output: {
    path: path.join(__dirname, 'dist/renderer/'),
    publicPath: '../',
    filename: '[name]/index.prod.js' // 输出则是每一个入口对应一个文件夹
  },  
  module: { 
    rules: [ 

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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/index.style.css'
    }),
    ...htmlWebpackPlugin
  ]
});

```



src/renderer/index/index.ts

```html
function showHelloWorld(){
    document.body.innerHTML = "Hello Wolrd !!!"
}
showHelloWorld();
```



### 3、添加运行命令

到此为止，已经完成了主进程的打包配置，这里可以直接测试项目生产环境的打包结果。

首先向package.json中添加相应的运行命令，build-renderer打包渲染进程

```
{
  ...
  "main": "dist/main/main.prod.js",
  "scripts": {
    ...
    "build-renderer": "cross-env NODE_ENV=production webpack --config webpack.renderer.prod.config.js"
    "build": "concurrently \"npm run build-main\" \"npm run build-renderer\"",
    ...
  },
  ...
}
```



### 4、测试

使用`build-renderer`命令并行打包主进程代码

```bash
npm run build-renderer
```



## 六、启动应用

### 1、添加运行命令

到此为止，已经完成了主进程的打包配置，这里可以直接测试项目生产环境的打包结果。

首先向package.json中添加相应的运行命令，build-renderer打包渲染进程

```
{
  ...
  "main": "dist/main/main.prod.js",
  "scripts": {
    ...    
    "start-main": "electron ./dist/main/main.prod.js"
    ...
  },
  ...
}
```

### 2、运行

```shell
npm run start-main
```



## 七、整合VUE

### 1、vue安装

```shell
npm install vue vue-router --save-dev
```

### 2、vue-loader vue-template-compiler

```shell
npm install vue-loader vue-template-compiler --save-dev
npm install --save-dev clean-webpack-plugin
```

### 3、修改配置文件

webpack.base.config.js 添加 vue解析

```javascript
...
 resolve: {
    extensions: ['.js', '.json', '.ts','.vue','.styl'],
    alias: {
      '~native': path.resolve(__dirname, 'native'), // 别名，方便import
      '~resources': path.resolve(__dirname, 'resources') // 别名，方便import      
    }
  },
...
```

webpack.renderer.prod.config.js

```javascript
// 渲染进程prod环境webpack配置
const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成index.html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 文本分离插件，分离js和css
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理垃圾文件

const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

const { VueLoaderPlugin } = require('vue-loader'); // vue加载器
const port = 3002;
const isProd = process.env.NODE_ENV === 'production';

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
  entry: {
    index: './src/renderer/index.ts' // 入口文件
  }, 
  mode: 'production',
  target: 'electron-preload',  
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
                        css: cssConfig
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
      template: join(__dirname, 'src/renderer/index.html'), // 引入模版
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

```

## 八、配置VUE，支持typescript

### 1、添加vuevue-shims.d.ts

在src/renderer/ 下，添加vue-shims.d.ts，使ts识别vue文件

```typescript
declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}
```

### 2、修改vue引入方式

```typescript
import App from './App.vue';
```

## 九、开发模式配置

### 1、安装 webpack-dev-server 

```
npm install webpack-dev-server --save-dev
```

### 2、回退 webpack-cli

1. 卸载当前的 webpack-cli `npm uninstall webpack-cli`
2. 安装 webpack-cli 3.* 版本 `npm install webpack-cli@3 -D`

### 3、webpack配置webpack.renderer.dev.config.js

```javascript
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
    index: './src/renderer/index.ts' // 入口文件
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
      NODE_ENV: 'development'
    }),
    new MiniCssExtractPlugin({ // 分离css
      filename: 'stylesheets/[name].[contenthash:5].css'
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src/renderer/index.html'), // 引入模版
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

```

### 4、webpack配置package.json

```
"dev-main": "cross-env NODE_ENV=development webpack --config webpack.main.dev.config.js && electron ./dist/main/main.dev.js",
    "dev-renderer": "cross-env NODE_ENV=development webpack-dev-server --config webpack.renderer.dev.config.js",
    "dev": "npm run dev-renderer"
```

