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

#### 安装命令

```bash
npm install --save-dev typescript
```

#### 配置文件

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

#### 配置文件详解

https://www.cnblogs.com/cczlovexw/p/11527708.html



### 三、WebPack安装

https://webpack.docschina.org/



#### WebPack项目打包流程示意图![img](https://user-gold-cdn.xitu.io/2020/7/2/1730d1b6e95392f7?w=1578&h=992&f=png&s=120682)

#### 安装webpack

##### 1.webpack本身

```bash
npm install --save-dev webpack webpack-cli webpack-merge
```

##### 2.安装webpack-node-externals

主进程打包时只需要将src/main下的所有ts文件打包到dist/main下，值得注意的是，主进程对应的是node工程，如果直接使用webpack进行打包会将node_modules中的模块也打包进去，所以这里使用webpack-node-externals插件去排除node_modules模块

```shell
npm install --save-dev webpack-node-externals
```

##### 3. 为支持typescript，安装ts-loader

`css-loader`、`sass-loader`、`style-loader`处理样式，`url-loader`、`file-loader`处理图片和字体，[resolve-url-loader](https://www.npmjs.com/package/resolve-url-loader)处理scss文件`url()`中的相对路径问题

```shell
npm install ts-loader --save-dev
```

##### 4.配置基础配置文件

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



### 四、主进程webpack打包配置



#### 配置文件

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



#### 添加运行命令

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



#### 测试

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



### 五、渲染进程webpack打包配置（静态HTML）



#### 插件安装

先来看生产模式下的打包，安装相应的插件和loader，这里使用[html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)插件去生成html模版，而且需要对每一个页面生成一个.html文件

`css-loader`、`sass-loader`、`style-loader`处理样式，`url-loader`、`file-loader`处理图片和字体，[resolve-url-loader](https://www.npmjs.com/package/resolve-url-loader)处理scss文件`url()`中的相对路径问题

如果使用scss编写样式，所以需要安装`node-sass`包

```shell
npm install --save-dev css-loader file-loader sass-loader style-loader url-loader resolve-url-loader

npm install --save-dev node-sass

npm install --save-dev mini-css-extract-plugin html-webpack-plugin
```



#### 配置文件

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



#### 添加运行命令

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



#### 测试

使用`build-renderer`命令并行打包主进程代码

```bash
npm run build-renderer
```



### 六、启动应用

#### 添加运行命令

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

#### 运行

```shell
npm run start-main
```



### 七、整合VUE