const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 配置
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
    {
      name: 'Hugging Face',
      url: 'https://huggingface.co/blog',
      type: 'blog'
    },
    {
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/tag/ai/',
      type: 'news'
    },
    {
      name: 'VentureBeat AI',
      url: 'https://venturebeat.com/ai/',
      type: 'news'
    }
  ],
  // 文章存储目录
  postDir: path.join(__dirname, '../source/_posts'),
  // 每日更新的文章数量
  dailyPosts: 2
};

// 工具函数：获取当前日期
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return {
    year,
    month,
    day,
    dateString: `${year}-${month}-${day}`
  };
}

// 工具函数：生成文章文件名
function generateFileName(title) {
  return title
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase() + '.md';
}

// 工具函数：检查文章是否已存在
function isArticleExist(title) {
  const fileName = generateFileName(title);
  const filePath = path.join(config.postDir, fileName);
  return fs.existsSync(filePath);
}

// 工具函数：生成文章内容
function generateArticleContent(article) {
  const date = getCurrentDate();
  const frontMatter = `---
title: ${article.title}
date: ${date.dateString} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}:00
categories: ${article.category}
tags:
  - ${article.tag}
description: ${article.description}
---

${article.content}

## 原文链接

${article.url}
`;
  return frontMatter;
}

// 工具函数：保存文章到文件
function saveArticle(article) {
  const fileName = generateFileName(article.title);
  const filePath = path.join(config.postDir, fileName);
  const content = generateArticleContent(article);
  
  fs.writeFileSync(filePath, content);
  console.log(`成功保存文章：${article.title}`);
}

// 工具函数：从arXiv获取AI论文
async function fetchArXivPapers() {
  try {
    const response = await axios.get(config.sources[0].url);
    const html = response.data;
    
    // 简单的HTML解析，提取标题和链接
    const paperMatches = html.match(/<span class="descriptor">Title:<\/span>\s*<a href="([^"]+)">([^<]+)<\/a>/g);
    const papers = [];
    
    if (paperMatches) {
      paperMatches.slice(0, 10).forEach(match => {
        const urlMatch = match.match(/href="([^"]+)"/);
        const titleMatch = match.match(/>([^<]+)</);
        
        if (urlMatch && titleMatch) {
          const url = `https://arxiv.org${urlMatch[1]}`;
          const title = titleMatch[1].trim();
          
          papers.push({
            title,
            url,
            description: '来自 arXiv 的最新 AI 论文',
            content: '这是一篇来自 arXiv 的最新 AI 研究论文，内容涵盖了人工智能领域的前沿研究成果。',
            category: 'AI前沿',
            tag: 'arXiv'
          });
        }
      });
    }
    
    return papers;
  } catch (error) {
    console.error('获取 arXiv 论文时出错：', error.message);
    return [];
  }
}

// 工具函数：从新闻网站获取AI资讯
async function fetchAINews() {
  try {
    // 这里可以添加更复杂的新闻网站解析逻辑
    // 为了简单起见，我们使用模拟数据
    const news = [
      {
        title: 'GPT-4o: 全新的多模态大语言模型',
        url: 'https://openai.com/blog/gpt-4o',
        description: 'OpenAI 推出了全新的 GPT-4o 多模态大语言模型',
        content: 'OpenAI 宣布推出 GPT-4o，这是一款功能强大的多模态大语言模型，支持文本、图像和音频的处理。',
        category: 'LLM最新资讯',
        tag: 'OpenAI'
      },
      {
        title: 'Hugging Face 发布新的推理优化技术',
        url: 'https://huggingface.co/blog/inference-optimization',
        description: 'Hugging Face 宣布了新的模型推理优化技术',
        content: 'Hugging Face 发布了一项新的推理优化技术，可以显著提高大语言模型的处理速度。',
        category: 'LLM最新资讯',
        tag: 'Hugging Face'
      },
      {
        title: 'AI 辅助药物研发取得重大突破',
        url: 'https://techcrunch.com/2024/05/20/ai-driven-drug-discovery-breakthrough/',
        description: 'AI 在药物研发领域取得了重大突破',
        content: '研究人员使用 AI 技术成功开发出一种新的抗病毒药物，为治疗某些疾病提供了新的希望。',
        category: 'AI前沿',
        tag: '医疗AI'
      }
    ];
    
    return news;
  } catch (error) {
    console.error('获取 AI 新闻时出错：', error.message);
    return [];
  }
}

// 主函数：获取并保存文章
async function fetchAndSaveArticles() {
  console.log('开始获取 AI 相关文章...');
  
  // 获取文章
  const [arxivPapers, aiNews] = await Promise.all([
    fetchArXivPapers(),
    fetchAINews()
  ]);
  
  // 合并文章列表
  const allArticles = [...arxivPapers, ...aiNews];
  
  // 过滤已存在的文章
  const newArticles = allArticles.filter(article => !isArticleExist(article.title));
  
  // 保存文章（限制每日更新数量）
  const articlesToSave = newArticles.slice(0, config.dailyPosts);
  articlesToSave.forEach(article => saveArticle(article));
  
  console.log(`完成！共保存了 ${articlesToSave.length} 篇新文章。`);
}

// 导出函数
module.exports = {
  fetchAndSaveArticles
};

// 如果直接运行此脚本，则执行获取和保存文章的操作
if (require.main === module) {
  fetchAndSaveArticles().catch(error => {
    console.error('程序出错：', error);
  });
}
