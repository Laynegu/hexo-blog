# AI新闻自动获取脚本使用说明

## 功能概述

本脚本用于自动获取AI前沿和LLM最新资讯，并将其转换为Hexo博客文章格式，方便用户定期更新博客内容。

## 主要特性

- 自动从多个AI资讯源获取最新信息
- 支持arXiv论文、技术博客和新闻网站
- 自动生成符合Hexo格式的文章
- 防止重复发布相同内容
- 可配置每日更新文章数量

## 配置说明

### 1. 安装依赖

在运行脚本之前，需要安装必要的依赖：

```bash
cd /path/to/your/hexo/blog
npm install axios --save
```

### 2. 脚本配置

脚本中的主要配置项在 `ai-news-fetcher.js` 文件中定义：

```javascript
const config = {
  // 目标分类
  categories: ['AI前沿', 'LLM最新资讯'],
  // 资讯源
  sources: [
    {
      name: 'arXiv',
      url: 'https://arxiv.org/list/cs.AI/recent',
      type: 'arxiv'
    },
    {
      name: 'OpenAI',
      url: 'https://openai.com/blog',
      type: 'blog'
    },
    // 更多资讯源...
  ],
  // 文章存储目录
  postDir: path.join(__dirname, '../source/_posts'),
  // 每日更新的文章数量
  dailyPosts: 2
};
```

### 3. 自定义配置

您可以根据需要修改以下配置：

- `categories`: 文章分类
- `sources`: 资讯源列表
- `dailyPosts`: 每日更新文章数量
- `postDir`: 文章存储目录

## 使用方法

### 方法一：直接运行脚本

```bash
cd /path/to/your/hexo/blog
node scripts/ai-news-fetcher.js
```

### 方法二：使用Cron定时任务

在Linux系统中，可以使用Cron定时任务来实现每日自动更新：

1. 打开Cron配置文件：
   ```bash
   crontab -e
   ```

2. 添加定时任务（每天早上8点运行）：
   ```bash
   0 8 * * * cd /path/to/your/hexo/blog && node scripts/ai-news-fetcher.js >> cron.log 2>&1
   ```

### 方法三：在Hexo构建过程中自动运行

可以在Hexo的`package.json`中添加脚本：

```json
{
  "scripts": {
    "update-news": "node scripts/ai-news-fetcher.js",
    "deploy": "npm run update-news && hexo clean && hexo generate && hexo deploy"
  }
}
```

然后使用以下命令部署博客：

```bash
npm run deploy
```

## 支持的资讯源

### 1. arXiv论文

获取计算机科学AI子领域的最新论文。

### 2. 技术博客

- OpenAI Blog
- Hugging Face Blog
- Medium上的AI相关博客

### 3. 新闻网站

- TechCrunch AI
- VentureBeat AI
- MIT Technology Review

## 文章格式

生成的文章格式如下：

```markdown
---
title: 文章标题
date: 2026-02-24 08:00:00
categories: AI前沿
tags:
  - arXiv
description: 文章描述
---

文章内容

## 原文链接

文章原文链接
```

## 注意事项

1. 脚本使用简单的HTML解析方法，可能会随着目标网站结构变化而失效
2. 某些网站可能有反爬虫机制，建议合理控制请求频率
3. 为了避免重复发布，脚本会检查文章标题是否已存在
4. 建议定期检查脚本运行状态，确保其正常工作

## 故障排除

### 1. 依赖安装问题

如果安装依赖时出现错误，可以尝试使用`--legacy-peer-deps`参数：

```bash
npm install axios --save --legacy-peer-deps
```

### 2. 网络连接问题

如果无法访问某些资讯源，可能是网络连接问题或网站已失效，可以尝试更换资讯源。

### 3. 文章解析问题

如果文章解析不正确，可能是目标网站结构发生了变化，需要更新解析规则。

## 扩展功能

### 添加新的资讯源

可以在`config.sources`中添加新的资讯源：

```javascript
{
  name: '新资讯源',
  url: 'https://example.com/ai-news',
  type: 'news'
}
```

然后需要实现对应的解析方法。

### 自定义文章格式

可以修改`generateArticleContent`函数来自定义文章格式。

### 添加更多分类

可以在`config.categories`中添加新的分类：

```javascript
categories: ['AI前沿', 'LLM最新资讯', '机器学习']
```

并在博客中创建对应的分类页面。

## 许可证

本脚本仅供个人使用，使用时请遵守各资讯源的使用条款。
