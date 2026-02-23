const { fetchAndSaveArticles } = require('./scripts/ai-news-fetcher');

console.log('测试AI新闻获取脚本...');

fetchAndSaveArticles().catch(error => {
  console.error('测试过程中出现错误：', error);
  process.exit(1);
});
