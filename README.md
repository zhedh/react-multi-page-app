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

## 流程优化

### 分离开发生产环境

**新建 config 目录，并创建配置文件**

```bash
mkdir config
cd config
touch webpack.base.js
touch webpack.dev.js
touch webpack.prod.js
```

```txt
├── webpack.base.js
├── webpack.dev.js
└── webpack.prod.js
```

**基础配置**

webpack.base.js

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
        test: /\.js$/,
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
    }),
    new HtmlWebpackPlugin({
      filename: "page2/index.html",
      chunks: ["page2"],
    }),
  ],
};
```

**开发配置**

- 安装 webpack-merge，用于合并 webpack 配置信息

```bash
yarn add -D webpack-merge
```

- 安装 webpack-dev-server，用于启动开发服务

```bash
yarn add -D webpack-dev-server
```

- 开发配置如下

webpack.dev.js

```js
const { merge } = require("webpack-merge");
const path = require("path");
const base = require("./webpack.base");

module.exports = merge(base, {
  mode: "development",
  devtool: "inline-source-map",
  target: "web",
  devServer: {
    open: true,
    contentBase: path.join(__dirname, "./dist"),
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    hot: true, // 开启热更新,
    port: 8000,
  },
});
```

- 配置启动命令

package.json

```json
{
  "scripts": {
    "start": "webpack serve --mode development --env development --config config/webpack.dev.js"
  },
}
```

- 启动

```bash
yarn start
```

- 预览

> http://localhost:8000/page1
> http://localhost:8000/page2

**生产配置**

- 配置如下

webpack.prod.js

```js
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
    mode: 'production',
})
```

- 配置打包命令

package.json

```json
{
  "scripts": {
    "start": "webpack serve --mode development --env development --config config/webpack.dev.js",
    "build": "webpack --config config/webpack.prod.js"
  },
}
```

- 打包

```bash
yarn build
```

### 引入React

以page1页面为例

- 约定目录

```txt
├── page1
│   ├── app.jsx
│   ├── index.jsx
│   └── index.css
└── page2
    ├── app.js
    ├── index.jsx
    └── index.css
```

- 安装react

```bash
yarn add react react-dom
```

- 代码如下

app.js

```js
import React from 'react'

function App() {
  return (
    <div id="page1">
      我是PAGE1，Hello World
    </div>
  )
}

export default App
```

index.js

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import './index.css'

ReactDOM.render(<App />, document.getElementById('root'))
```

index.css

```css
body{
  background-color: #ccc;
}

#page1 {
  color: rebeccapurple;
}
```

- 添加react编译

webpack.base.js

```js
module.exports = {
  module: {
    // ...
    rules: [
      // ...
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  },
  // ...
}
```

- 省略获取文件后缀

webpack.base.js

```js
module.exports = {
  // ...
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
}
```

- 添加html默认模版，挂载 React DOM

```bash
cd src
touch template.html
```

template.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div id="root"></div>
</body>

</html>
```

webpack.base.js

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'page1/index.html',
      chunks: ['page1'],
      template: './src/template.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'page2/index.html',
      chunks: ['page2'],
      template: './src/template.html'
    }),
  ],
}
```

- 安装依赖

```bash
yarn add @babel/preset-react @babel/plugin-proposal-class-properties
```

### 引入Sass

以 page1 为例

- 将 index.css 变更为 index.scss

index.scss

```scss
body {
  background-color: #ccc;

  #page1 {
    color: rebeccapurple;
  }
}
```

- 添加scss编译

webpack.base.js

```js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          'sass-loader'
        ]
      },
    ]
  },
  // ...
}

```

- 安装依赖

```bash
yarn add -D resolve-url-loader sass-loader
```

到此，一个完整的 React 多页面应用搭建完成，查看完整代码[react-multi-page-app](https://github.com/zhedh/react-multi-page-app/)

### 入口配置和模版自动匹配

为了不用每次新增页面都要新增入口页面配置，我们将入口配置改成自动匹配

- 入口文件自动匹配

```bash
cd config
touch webpack.util.js
```

webpack.util.js

```js
const glob = require('glob')

function setEntry() {
  const files = glob.sync('./src/pages/**/index.jsx')
  const entry = {}
  files.forEach(file => {
    const ret = file.match(/^\.\/src\/pages\/(\S*)\/index\.jsx$/)
    if (ret) {
      entry[ret[1]] = {
        import: file,
      }
    }
  })

  return entry
}

module.exports = {
  setEntry,
}
```

webpack.base.js

```js
const { setEntry } = require('./webpack.util')

module.exports = {
  entry: setEntry,
}
```

- 拆分 React 依赖，将 React 单独打包出一个 bundle，作为公共依赖引入各个页面

webpack.util.js

```js
function setEntry() {
  const files = glob.sync('./src/pages/**/index.jsx')
  const entry = {}
  files.forEach(file => {
    const ret = file.match(/^\.\/src\/pages\/(\S*)\/index\.jsx$/)
    if (ret) {
      entry[ret[1]] = {
        import: file,
        dependOn: 'react_vendors',
      }
    }
  })

  // 拆分react依赖
  entry['react_vendors'] = {
    import: ['react', 'react-dom'],
    filename: '_commom/[name].js'
  }

  return entry
}
```

- html 模版自动匹配，并引入react bundle

以 page1 为例子，引入页面自定义模版目录约定如下

```txt
├── app.jsx
├── index.html
├── index.jsx
└── index.scss
```

index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面1</title>
</head>

<body>
  <div id="root"></div>
</body>

</html>
```

如果匹配不到自定义模版，会匹配默认模版，配置如下：

webpack.util.js

```js
function getTemplate(name) {
  const files = glob.sync(`./src/pages/${name}/index.html`)
  if (files.length > 0) {
    return files[0]
  }
  return './src/template.html'
}

function setHtmlPlugin() {
  const files = glob.sync('./src/pages/**/index.jsx')
  const options = []
  files.forEach(file => {
    const ret = file.match(/^\.\/src\/pages\/(\S*)\/index\.jsx$/)
    if (ret) {
      const name = ret[1]
      options.push(new HtmlWebpackPlugin({
        filename: `${name}/index.html`,
        template: getTemplate(name),
        chunks: ['react_vendors', name,]
      }))
    }
  })
  return options
}

module.exports = {
  setEntry,
  setHtmlPlugin
}
```

webpack.base.js

```js
const { setEntry, setHtmlPlugin } = require('./webpack.util')

module.exports = {
  plugins: [
    ...setHtmlPlugin(),
  ]
}
```

- 安装相关依赖

```bash
yarn add -D html-webpack-plugin glob
```

### 配置优化

- 清除之前打包文件

webpack.base.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
  ]
}
```

```bash
yarn add -D clean-webpack-plugin
```

- 分离并压缩 css

webpack.base.js

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
   module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]/index.css',
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
}
```

html 中注入 css
webpack.util.js

```js
function setHtmlPlugin() {
  const files = glob.sync('./src/pages/**/index.jsx')
  const options = []
  files.forEach(file => {
    const ret = file.match(/^\.\/src\/pages\/(\S*)\/index\.jsx$/)
    if (ret) {
      const name = ret[1]
      options.push(new HtmlWebpackPlugin({
        filename: `${name}/index.html`,
        template: getTemplate(name),
        chunks: ['react_vendors', name, '[name]/index.css']
      }))
    }
  })
  return options
}
```

```bash
yarn add -D mini-css-extract-plugin optimize-css-assets-webpack-plugin
```

```

在 package.json 配置 sideEffects，避免 webpack Tree Shaking 移除.css、.scss 文件
package.json

​```json
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

至此，项目配置完成

## 项目源码

完整代码[react-multi-page-app](https://github.com/zhedh/react-multi-page-app/)，喜欢给个star

## 问题&解答

**Cannot read property 'createSnapshot' of undefined**

报错：UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'createSnapshot' of undefined

原因：因为同时运行 2 个不同版本的 webpack。我们项目中没有安装 webpack-cli，webpack 会默认使用全局的 webpack-cli，webpack5 和 webpack-cli3 不兼容

解决：升级全局 webpack-cli3 到 webpack-cli4 或在项目中安装最新版本的 webpack-cli4

参考：https://github.com/jantimon/html-webpack-plugin/issues/1456
