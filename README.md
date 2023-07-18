# Web-Programming
华东师范大学数据科学与工程学院数据科学与大数据技术专业Web编程课程期末项目 From **10215501434 李睿恩**.

完整内容详见 github: https://github.com/HonokaKousaka/Web-Programming

核心需求：
1. 选取1-2个代表性的新闻网站（比如新浪新闻、网易新闻等，或者某个垂直领域权威性的网站比如经济领域的雪球财经、东方财富等，或者体育领域的腾讯体育、虎扑体育等等）建立爬虫，针对不同网站的新闻页面进行分析，爬取出编码、标题、作者、时间、关键词、摘要、内容、来源等结构化信息，存储在数据库中。
2. 建立网站提供对爬取内容的分项全文搜索，给出所查关键词的时间热度分析。

具体内容：

&emsp;&emsp;对于官方媒体，利用 JavaScript 的信息爬取方法获得了来自网易新闻首页，澎湃新闻首页和中国青年网首页的连续多天的新闻数据，这些数据被置入 MySQL 数据库中；利用 Express 框架实现了一个可以对官方新闻完成信息检索、热度分析的网站。

&emsp;&emsp;出于对华东师范大学近期关注的事件的好奇，华东师范大学的新闻也被纳入信息爬取范畴。 利用 JavaScript 的信息爬取方法获得了来自华东师范大学“新闻热点”栏目的连续多天的新闻数据，这些数据被置入 MySQL 数据库中；利用 Express 框架实现了一个可以完成对华东师范大学新闻信息检索、热度分析的网站。

&emsp;&emsp;**每个重要的代码文件中都会有详尽的注释。**

## 网页演示.mp4
&emsp;&emsp;**具体展示了网页各功能的使用。** 如果想要知道网页最后的完成效果与功能，以及试图复现网页中的功能，可以观看该视频。视频时长1分钟41秒。

&emsp;&emsp;**最终版本的网页外观与视频中的有出入（如词云图形状，页面底部版权声明等），但在功能性上是一致的。如果想对外观进行更多观察，请以利用最新代码生成的网页为准。**

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
2. **制作了导航栏，功能区分明确，页面更加美观。**
3. **将 URL 化为指向自身的超链接，页面更加简洁。**
4. **制作了翻页功能，实现了根据输入的页码进行跳转的功能。**
5. **允许了通过按下 Enter 键进行相应搜索，更加符合多数人的使用习惯。**
6. **允许了基于某个特定条件进行查询，查询更加灵活。**
7. **允许了基于多个特定条件进行查询，查询更加灵活。**
8. **允许了将查询结果基于某个条件进行排序，查询更加灵活。**
9. **基于 Echarts 绘制了折线图，对热度进行了分析。**
10. **基于 Echarts 绘制了词云图，并且自定义了词云图的图案。**

## 实现难点与克服过程
1. 信息爬取的 JavaScript 代码执行总是报错

&emsp;&emsp;运行课程所提供的 crawler.js 的代码，容易发现代码会出现各种各样的问题。即使是针对不同的网站进行不同的修改，这段代码的出错率仍然很高。经过研究，发现代码可能因如下原因出错。
* 网站设立了反爬机制。目前我的代码水平不足以支撑我爬取设立了严格反爬机制的网站，故解决方案为更换网站。
* 缺少关键模块。因缺少某个重要模块，导致代码的编译都无法通过。解决方案为安装相应模块，具体地说，可以在命令提示符中输入 npm install $nameOfPackage$。
* 确定新闻网页的具体 URL 时出错。这主要是因为在课程提供的代码中，seedurl_news 函数中确定新闻网页 URL 的方式是基于中国新闻网的，而不同新闻网的 .html 文件中对具体新闻网页的链接方式均有所不同。解决方案是，具体分析每一个新闻网站首页的源代码，分析具体新闻页面的链接方式，从而得到正确的页面。
* 正则表达式书写不准确。在匹配具体新闻网页与书写 cheerio 选择器的过程中，均需要使用正则表达式的思想。对于不同的网页，我们需要采用不同的正则表达式。解决方案是具体分析每一个新闻网的具体新闻网页的源代码，为每一个新闻网选择正确的正则表达式。

2. 习惯性地按下 Enter 来搜索，却发现没有效果

&emsp;&emsp;如果直接在搜索框中按下 Enter，就会导致网页提交表单，但是我们并没有为这种形式的提交表单编写任何响应机制。为了能够符合大多数人的使用习惯，我编写了多个允许通过 Enter 来触发事件的函数。主体思想是，不允许在按下 Enter 的时候触发默认的提交表单行为，而是转而去执行在该页面点击按钮时会触发的事件。这在内容查询、热度分析、翻页等多个搜索框中均得到了实现。

3. 绘制热度分析图与词云图时，数据难以处理

&emsp;&emsp;尽管我们有可以生成折线图与词云图的代码，但将我们得到的数据进行处理，将其转化为可以用于绘图的数据类型却是一个难题。

&emsp;&emsp;在绘制折线图时，我们需要先把所有互异的时间点全部提取，并且计算在该日期的新闻数量。

&emsp;&emsp;在绘制词云图时，我们需要先把所有互异的关键词全部提取，并且计算每一个关键词出现的频数。不同的网站会对关键词有不一样的书写方式，有的网站会用逗号分隔关键词，有的网站会用分号分隔关键词，有的网站会用空格分隔关键词。这为我们的数据处理增加了难度。

&emsp;&emsp;最终，经过反复地编写与调试，该任务得到了完成。

4. 第一次点击”词云展示“时，词云图没有被正确显示

&emsp;&emsp;理论上说，无论用户在任何时候点击“词云展示”按钮，都将能够得到一个实时生成的词云图。然而，我在首次编写时却意外地发现，每次新开启我的网页时，第一次点击“词云展示”按钮后，页面上不会显示我的词云图，而在之后的每次点击中，词云图却正确地出现了页面中央。

&emsp;&emsp;这个问题虽然是一个小问题，小到在进行课程汇报的时候可以无视它的存在的，但必须承认它的存在让这个功能不太完美。经过研究，我发现可能是因为，在执行让词云图出现在页面上的方法时，词云图的渲染并没有执行结束。意即，在生成正确的词云图之前，我就已经希望词云图显示在页面上了。这样做的后果就是页面上什么都不显示。

&emsp;&emsp;最终，我发现调用 setTimeout 函数可以将图像显示方法推迟到下一个事件循环中执行，确保了在 DOM（文档对象模型）更新后再显示词云图，解决了问题。

5. 缺少对于 MySQL, CSS, HTML 语法的认识

&emsp;&emsp;编写 HTML 时，本质上是在编写网页上应当拥有的元素，并且让其中的一些元素具有一些功能。编写 CSS 时，本质上是让网页能够有一定的美观程度。然而，学习这门课程的时间非常短暂，这很难让我们可以对 HTML 与 CSS 的语法有充分的认识。因此，在学习的过程中，我不得不多次反复查阅网络资料才能完成课程的项目。

&emsp;&emsp;MySQL 是一个非常实用的数据库。但是，这也是我首次真正接触与使用 MySQL，这势必意味着我对其语法也没有一个非常完备的认识。我不得不多次查阅网络资料来增加我对 MySQL 语法的认识。

## 课程总结
&emsp;&emsp; Web编程作为暑期小学期的课程，它的课时较少，练习时间较短，这无疑为我们制作期末项目增加了不少的难度。我原本以为自己会在这门课上理解地非常痛苦与吃力，但在经过一段时间地努力研究后，仍然是完成了一个可以实现基本功能的期末项目。

&emsp;&emsp;虽然在一开始，制作 HTML 页面是一个很让人没有方向的任务，但在一段时间的学习后，逐渐地也发现了编写 HTML 有一定的规则与模板。编写 CSS 文件也是一样的，初次尝试的确困难，但随着我为更多元素设计排版，我也逐渐感受到了 CSS 的规律之处。虽然我可能在短短两三个星期的学习后，对 HTML 和 CSS 的认识不会到达一个特别高的高度，但我仍然相信自己未来可以在编写前后端方面有更多地进步。

&emsp;&emsp;JavaScript 的确对我来说是一个崭新的编程语言。起初，我也会不理解其存在的意义，认为其他语言会比 JavaScript 更具功能性。但当我发现在 HTML 文件中嵌入的 JavaScript 有很好的适配性时，我也能逐渐理解并习惯 JavaScript的功能了。

&emsp;&emsp;总之，这门课带领我编写 JavaScript 与网页，给我带来了不小的成就感，也给我带来了不小的收获。



