# Web-Programming
华东师范大学数据科学与工程学院数据科学与大数据技术专业Web编程课程期末项目 From 10215501434 李睿恩.

核心需求：
1. 选取1-2个代表性的新闻网站（比如新浪新闻、网易新闻等，或者某个垂直领域权威性的网站比如经济领域的雪球财经、东方财富等，或者体育领域的腾讯体育、虎扑体育等等）建立爬虫，针对不同网站的新闻页面进行分析，爬取出编码、标题、作者、时间、关键词、摘要、内容、来源等结构化信息，存储在数据库中。
2. 建立网站提供对爬取内容的分项全文搜索，给出所查关键词的时间热度分析。

具体内容：

&emsp;&emsp;对于官方媒体，利用 JavaScript 的信息爬取方法获得了来自网易新闻首页，澎湃新闻首页 和中国青年网首页的连续多天的新闻数据，这些数据被置入 MySQL 数据库中；利用 Express 框架实现了一个可以对官方新闻完成信息检索、热度分析的网站。


&emsp;&emsp;出于对华东师范大学近期关注的事件的好奇，华东师范大学的新闻也被纳入信息爬取范畴。 利用 JavaScript 的信息爬取方法获得了来自华东师范大学“新闻热点”栏目的连续多天的新闻数据，这些 数据被置入 MySQL 数据库中；利用 Express 框架实现了一个可以完成对华东师范大学新闻信息检索、热度分析的网站。

## Crawler
### Crawler_ECNU_Mysql.js
&emsp;&emsp;实现了对华东师范大学“新闻热点”栏目 ( URL: https://www.ecnu.edu.cn/xwlm/xwrd.htm ) 近2个月的新闻爬取。这些数据被置入 MySQL 数据库中的 ecnu 表中。**华东师范大学“新闻热点”栏目的新闻是需要翻页浏览的，因此该代码对这个特点进行了特殊的处理：考虑了华东师范大学“新闻热点”栏目的 URL 的风格，实现了对连续多页数据的爬取。**

### Crawler_Netease_Mysql.js
&emsp;&emsp;实现了对网易 ( URL: https://www.163.com/ ) 的新闻爬取。这些数据被置入 MySQL 数据库中的 fetches 表中。

### Crawler_Pengpai_Mysql.js
&emsp;&emsp;实现了对澎湃新闻 ( URL: https://www.thepaper.cn/ ) 的新闻爬取。这些数据被置入 MySQL 数据库中的 fetches 表中。

### Crawler_Youth_Mysql.js
&emsp;&emsp;实现了对中国青年网 ( URL: https://www.youth.cn/ ) 的新闻爬取。这些数据被置入 MySQL 数据库中的 fetches 表中。

### ecnu.sql
&emsp;&emsp;规定了在 MySQL 数据库中，ecnu 表中数据存储的格式。

### fetches.sql
&emsp;&emsp;规定了在 MySQL 数据库中，fetches 表中数据存储的格式。

## ecnu_site / search_site
&emsp;&emsp;实现了一个可以对 MySQL 数据库中数据进行查询的网页。其中，ecnu_site 是针对 ecnu 表中数据的查询，search_site 是针对 fetches 表中数据的查询。

&emsp;&emsp;以下文件均在 ecnu_site 和 search_site 中存在。

### ./public/index.html
&emsp;&emsp;实现了网页的前端与后端。

### ./public/mystyle.css
&emsp;&emsp;实现了网页外观的美化。

### ./routes/index.js
&emsp;&emsp;实现了在网页中对 MySQL 数据库中 ecnu / fetches 表中数据的查询。

### ./public/javascripts/echarts-wordcloud
&emsp;&emsp;允许了在网页中基于 Echarts 绘制词云图。

## 功能实现与拓展优化
1. 完成了基本的内容查询功能。
2. 制作了导航栏，功能区分明确，页面更加美观。
3. 将 URL 化为指向自身的超链接，页面更加简洁。
4. 制作了翻页功能，实现了根据输入的页码进行跳转的功能。
5. 允许了通过按下 Enter 键进行相应搜索，更加符合多数人的使用习惯。
6. 允许了基于某个特定条件进行查询，查询更加灵活。
7. 允许了基于多个特定条件进行查询，查询更加灵活。
8. 允许了将查询结果基于某个条件进行排序，查询更加灵活。
9. 基于 Echarts 绘制了折线图与词云图，对热度进行了分析。