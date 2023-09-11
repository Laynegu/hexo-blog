---
title: SPA? MPA?
date: 2023-09-12 01:27:18
toc: true
categories: 前端
tags:
  - 单页面应用
  - 多页面应用
  - 微前端
---
## 单页面应用还是多页面应用

何时用 SPA，何时用 MPA ？

## 分析

- SPA - Single-page Application 单页面应用，只有一个 html 文件，用前端路由切换功能
- MPA - Multi-page Application 多页面应用，每个页面是单独的 html 文件

现在基于 React Vue 开发时，大部分产出的都是 SPA ，很少会产出 MPA 。<br>
但并不是所有的场景都适用于 SPA ，项目设计时要确定好，否则后面不好改。

## SPA 适用于一个综合应用

特点
- 功能较多，一个界面展示不完
- 以操作为主，不是以展示为主

举例
- 大型的后台管理系统（阿里云的管理后台）
- 知识库（语雀、腾讯文档）
- 功能较复杂的 WebApp（外卖）

## MPA 适用于孤立的页面

特点
- 功能较少，一个页面展示得开
- 以展示为主，而非操作

举例
- 分享页（微信公众号文章）
- 新闻 App 里的落地页（有可能是用 H5 + hybrid 开发的）

## Webpack 打包

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  // 多入口
  entry: {
    home: './src/home/index.js',
    product: './src/product/index.js',
    about: './src/about/index.js'
  },
  output: {
    filename: 'js/[name].[contentHash].js', // name 即 entry 的 key
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
    new CleanWebpackPlugin(),

    // 三个页面
    new HtmlWebpackPlugin({
      title: '首页',
      template: './template/index.html',
      filename: 'home.html',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      title: '产品',
      template: './template/product.html',
      filename: 'product.html',
      chunks: ['product']
    }),
    new HtmlWebpackPlugin({
      title: '关于',
      template: './template/about.html',
      filename: 'about.html',
      chunks: ['about']
    })
  ]
}
```
