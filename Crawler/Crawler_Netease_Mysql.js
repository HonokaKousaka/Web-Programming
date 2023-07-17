// 爬取的新闻网网址
var source_name = "网易新闻网";
var domain = 'https://www.163.com/';
var myEncoding = "utf-8";
var seedURL = 'https://www.163.com/';

// cheerio选择器
var seedURL_format = "$('a')";
var keywords_format = " $('meta[name=\"keywords\"]').eq(0).attr(\"content\")";
var title_format = "$('title').text()";
var date_format = "$('.post_info').text()";
var author_format = "$('meta[name=\"author\"]').eq(0).attr(\"content\")";
var content_format = "$('.post_body').text()";
var desc_format = " $('meta[name=\"description\"]').eq(0).attr(\"content\")";
var source_format = "$('.post_author').text()";

// 正则表达式
var url_reg = /\/news\/article\/(\w{16}).html/;
var regExp = /\d{4}-\d{2}-\d{2}/

// 添加必要模块
var fs = require('fs');
var myRequest = require('request');
var myCheerio = require('cheerio');
var myIconv = require('iconv-lite');
var mysql = require('./mysql.js');
var schedule = require('node-schedule');
require('date-utils');

// 防止网站屏蔽我们的爬虫
var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
}

// 为爬虫设置时间间隔
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() - start < delay) {
        continue;
    }
}

// request模块异步fetch url
function request(url, callback) {
    var options = {
        url: url,
        encoding: null,
        //proxy: 'http://x.x.x.x:8080',
        headers: headers,
        timeout: 10000 //
    }
    myRequest(options, callback)
}

// 定时爬虫
var rule = new schedule.RecurrenceRule();
var times = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
var times2 = [0, 30];
rule.hour = times;
rule.minute = times2;

schedule.scheduleJob(rule, function() {
    seedget();
})

// 读种子页面
function seedget() {
    request(seedURL, function(err, res, body) { // 读取种子页面
        try {
            // 用iconv转换编码
            var html = myIconv.decode(body, myEncoding);
            //console.log(html);
            // 准备用cheerio解析html
            var $ = myCheerio.load(html, { decodeEntities: true });
        } catch (e) { console.log('读种子页面并转码出错：' + e) };

        var seedurl_news;

        try {
            seedurl_news = eval(seedURL_format);
            //console.log(seedurl_news);
        } catch (e) { console.log('url列表所处的html块识别出错：' + e) };

        seedurl_news.each(function(i, e) { // 遍历种子页面里所有的a链接
            var myURL = "";
            try {
                // 得到具体新闻url
                var href = "";
                href = $(e).attr("href");
                if (href && (href.toLowerCase().indexOf('http://') >= 0 || href.toLowerCase().indexOf('https://') >= 0))
                    myURL = href; //http://开头的
                else if (href && href.startsWith('//')) myURL = 'http:' + href; // //开头的
                else myURL = seedURL.substr(0, seedURL.lastIndexOf('/') + 1) + href; // 其他

            } catch (e) { console.log('识别种子页面中的新闻链接出错：' + e) }

            if (!url_reg.test(myURL)) return; // 检验是否符合新闻url的正则表达式
            //console.log(myURL);
            var fetch_url_Sql = 'select url from fetches where url=?';
            var fetch_url_Sql_Params = [myURL];
            mysql.query(fetch_url_Sql, fetch_url_Sql_Params, function(qerr, vals, fields) {
                if (vals.length > 0) {
                    console.log('URL duplicate!')
                }
                else newsGet(myURL);
            })
        });
    });
}

function newsGet(myURL) { // 读取新闻页面
    request(myURL, function(err, res, body) { // 读取新闻页面
        try {
            var html_news = myIconv.decode(body, myEncoding); // 用iconv转换编码
            //console.log(html_news);
            // 准备用cheerio解析html_news
            var $ = myCheerio.load(html_news, { decodeEntities: true });
        } catch (e) {
            console.log('读新闻页面并转码出错：' + e);
            return 0;
        };
        console.log("转码读取成功:" + myURL);
        // 动态执行format字符串，构建json对象准备写入文件或数据库
        var fetch = {};
        fetch.title = "";
        fetch.content = "";
        fetch.publish_date = (new Date()).toFormat("YYYY-MM-DD");
        fetch.url = myURL;
        fetch.source_name = source_name;
        fetch.source_encoding = myEncoding; // 编码
        fetch.crawltime = new Date();

        if (keywords_format == "") fetch.keywords = source_name; // eval(keywords_format);  // 没有关键词就用sourcename
        else fetch.keywords = eval(keywords_format).trim();

        if (title_format == "") fetch.title = ""
        else fetch.title = eval(title_format).trim(); // 标题

        if (date_format == "") {
            fetch.publish_date = eval(date_format); // 刊登日期
        }
        else fetch.publish_date = regExp.exec(fetch.publish_date)[0];
        fetch.publish_date = new Date(fetch.publish_date).toFormat("YYYY-MM-DD");

        if (author_format == "") fetch.author = source_name; //eval(author_format);  // 作者
        if (eval(author_format) == undefined) fetch.author = source_name;
        else fetch.author = eval(author_format).trim();

        if (content_format == "") fetch.content = "";
        // else fetch.content = eval(content_format).replace("\r\n" + fetch.author, ""); // 内容,是否要去掉作者信息自行决定
        else fetch.content = eval(content_format).trim();

        if (source_format == "") fetch.source = fetch.source_name;
        // else fetch.source = eval(source_format).replace("\r\n", ""); // 来源
        else
        {
            fetch.source = eval(source_format).trim();
            fetch.source = fetch.source.substring(fetch.source.indexOf("：")+1);
            fetch.source = fetch.source.substring(0, fetch.source.indexOf("\n"));
            fetch.source = fetch.source.replace(" ","");
            fetch.source = fetch.source.replace("举报","");
            console.log(fetch.source);
        }

        if (desc_format == "") fetch.desc = fetch.title;
        else fetch.desc = eval(desc_format).trim(); // 摘要
        var fetchAddSql = 'INSERT INTO fetches(url,source_name,source_encoding,title,' +
            'keywords,author,publish_date,crawltime,content) VALUES(?,?,?,?,?,?,?,?,?)';
        var fetchAddSql_Params = [fetch.url, fetch.source, fetch.source_encoding,
            fetch.title, fetch.keywords, fetch.author, fetch.publish_date,
            fetch.crawltime.toFormat("YYYY-MM-DD HH24:MI:SS"), fetch.content
        ];

        // 执行sql，数据库中fetch表里的url属性是unique的，不会把重复的url内容写入数据库
        mysql.query(fetchAddSql, fetchAddSql_Params, function(qerr, vals, fields) {
            if (qerr) {
                console.log(qerr);
            }
        }); // mysql写入
        sleep(500);
    });
}