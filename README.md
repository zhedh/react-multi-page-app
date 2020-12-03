# Webpack5 搭建 React 多页面应用

## 介绍

react-multi-page-app 是一个基于 webpack5 搭建的 react 多页面应用。

为什么搭建多页面应用：

- 多个页面之间业务互不关联，页面之间并没有共享的数据
- 多个页面使用同一个后端服务、使用通用的组件和基础库

搭建多页面应用的好处：

- 保留了传统单页应用的开发模式：支持模块化打包，你可以把每个页面看成是一个单独的单页应用
- 独立部署：每个页面相互独立，可以单独部署，解耦项目的复杂性，甚至可以在不同的页面选择不同的技术栈
- 减少包的体积，优化加载渲染流程

## 快速上手

**安装依赖**

```bash
yarn install
```

**打包**

```bash
webpack
```

## 简易搭建流程

### npm 初始化

```bash
yarn init
```

### 约定目录

```txt
|____README.md
|____package.json
|____src
| |____utils
| |____components
| |____pages
| | |____page2
| | | |____index.css
| | | |____index.jsx
| | |____page1
| | | |____index.css
| | | |____index.jsx
```

### Webpack 配置

**安装 Webpack**

yarn add -D 可以使用 npm i --save-dev 替代

```bash
yarn add -D webpack webpack-cli
```

**创建配置文件**

```bash
touch webpack.config.js
```

**入口配置**

```js
module.exports = {
  entry: {
    page1: "./src/pages/page1/index.jsx",
    page2: "./src/pages/page2/index.jsx",
    // ...
  },
};
```

**输出配置**

```js
module.exports = {
  entry: {
    page1: "./src/pages/page1/index.jsx",
    page2: "./src/pages/page2/index.jsx",
    // ...
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]/index.js",
  },
};
```

**js|jsx 编译**

安装 babel 插件

```bash
yarn add -D babel-loader @babel/core @babel/preset-env
```

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
}
```

**css 编译**

安装 loader

```bash
yarn add -D style-loader css-loader
```

```js
module.exports = {
  ...
  module: {
    ...
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
    ]
  },
}
```

**html 插件配置**

安装 html-webpack-plugin

```bash
yarn add -D html-webpack-plugin
```

```js
module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'page1/index.html',
      chunks: ['page1']
    }),
    new HtmlWebpackPlugin({
      filename: 'page2/index.html',
      chunks: ['page2']
    }),
  ],
}
```

### 页面编辑

**page1**

index.jsx

```js
import "./index.css";

document.querySelector("body").append("PAGE1");
```

index.css

```css
body {
  color: blue;
}
```

**page2**

index.jsx

```js
import "./index.css";

document.querySelector("body").append("PAGE2");
```

index.css

```css
body {
  color: green;
}
```

### 打包

执行

```bash
webpack
```

输出 dist 包产物如下：

```txt
├── page1
│   ├── index.html
│   └── index.js
└── page2
    ├── index.html
    └── index.js
```

### 完整的配置文件

webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    page1: "./src/pages/page1/index.jsx",
    page2: "./src/pages/page2/index.jsx",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]/index.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "page1/index.html",
      chunks: ["page1"],
      // chunks: ['page1', 'page1/index.css']
    }),
    new HtmlWebpackPlugin({
      filename: "page2/index.html",
      chunks: ["page2"],
    }),
  ],
};
```

package.json

```json
{
  "name": "react-multi-page-app",
  "version": "1.0.0",
  "description": "React 多页面应用",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.12.9",
    "@babel/preset-env": "^7.12.7",
    "babel-loader": "^8.2.2",
    "css-loader": "^5.0.1",
    "html-webpack-plugin": "^4.5.0",
    "style-loader": "^2.0.0",
    "webpack": "^5.9.0",
    "webpack-cli": "^4.2.0"
  }
}
```

去 github 查看简易版完整代码[react-multi-page-app](https://github.com/zhedh/react-multi-page-app/tree/simple)

## 问题&解答

**Cannot read property 'createSnapshot' of undefined**

报错：UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'createSnapshot' of undefined

原因：因为同时运行 2 个不同版本的 webpack。我们项目中没有安装 webpack-cli，webpack 会默认使用全局的 webpack-cli，webpack5 和 webpack-cli3 不兼容

解决：升级全局 webpack-cli3 到 webpack-cli4 或在项目中安装最新版本的 webpack-cli4

参考：https://github.com/jantimon/html-webpack-plugin/issues/1456
