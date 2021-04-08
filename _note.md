## 环境安装

### Webpack

```
npm install -g webpack
```



### 初始化项目

```
npm init
```

### Electron

https://www.electronjs.org/docs

```
npm i electron -D
```

### 创建文件夹

**app：**webpack编译后的整个项目的代码，包括主进程和渲染进程，使用electron-builder打包exe安装包时，会把这部分代码打进去；

​	**builder：**webpack打包脚本，包括打包主进程、渲染进程，打包各个环境的exe安装包，启动各个环境的devServer等；

​	**config：**配置文件，包括环境配置、版本等；

​	**dist：**构建出的静态文件，exe，zip等；

​	**src：**源码目录；

​		**main：**主进程源码；

​		**renderer：**渲染进程源码；



