// 爬取的新闻网网址
var source_name = "澎湃新闻";
var seedURL = 'https://www.thepaper.cn/';
var myEncoding = "utf-8";

// cheerio选择器
var seedURL_format = "$('a')";
var keywords_format = "$('meta[property=\"keywords\"]').eq(0).attr(\"content\")";
var title_format = "$('title').text()";
var date_format = "$('.ant-space-item').text()";
var content_format = "$('.index_cententWrap__Jv8jK').text()";
var source_format = "$('.post_info a').text()";

// 正则表达式
var url_reg = /\/newsDetail_forward_[0-9]{8}$/;
var regExp = /\d{4}-\d{2}-\d{2}/;

// 添加必要模块
var fs = require('fs');
var myRequest = require('request');
var myCheerio = require('cheerio');
var myIconv = require('iconv-lite');
var mysql = require('./mysql.js');
var schedule = require('node-schedule');
require('date-utils');

// 防止网站屏蔽爬虫
var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67'
};

/**
 * 定义了request函数
 * 调用该函数能够访问指定的url并且能够设置回调函数来处理得到的html页面。
 */
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

// 读取种子页面
function seedget() {
    request(seedURL, function (err, res, body) {
        try {
            // 用iconv转换编码
            var html = myIconv.decode(body, myEncoding);
            //console.log(html);
            // 准备用cheerio解析html
            var $ = myCheerio.load(html, {decodeEntities: true});
        } catch (e) {
            console.log('读种子页面并转码出错：' + e)
        }
        ;

        // 种子页面下的每一条新闻
        var seedurl_news;

        try {
            seedurl_news = eval(seedURL_format);
            // console.log(seedurl_news);
        } catch (e) {
            console.log('url列表所处的html识别出错: ' + e);
        }

        seedurl_news.each(function (i, e) {
            var myURL = "";
            try {
                // 得到具体新闻url
                var href = "";
                // 得到链接中的href属性
                href = $(e).attr("href");
                if (href == undefined) {
                    return;
                }
                // 如果是合法URL, 则赋值
                if (href.toLowerCase().indexOf('https://') >= 0) {
                    myURL = href;
                } else if (href.startsWith('/newsDetail')) {
                    myURL = 'https://www.thepaper.cn' + href;
                } else {
                    myURL = seedURL.substring(0, seedURL.lastIndexOf('/')) + href;
                }
            } catch (e) {
                // console.log('识别种子页面中的新闻链接出错: ' + e);
            }

            // 检查是否符合新闻URL的正则表达式
            if (!url_reg.test(myURL)) {
                return;
            }
            newsGet(myURL);
        });
    });
}

function newsGet(myURL) { // 读取新闻页面
    request(myURL, function(err, res, body) {
        var html_news = myIconv.decode(body, myEncoding);
        // console.log("error " + html_news);
        // 用cheerio解析html_news
        var $ = myCheerio.load(html_news, { decodeEntities:true });
        myhtml = html_news;
        // console.log("转码读取成功: " + myURL);

        // 动态执行format字符串，构建json对象准备写入文件或数据库
        var fetch = {};
        fetch.title = "";
        fetch.content = "";
        // fetch.publish_date = new Date(fetch.publish_date).toFormat("YYYY-MM-DD");
        fetch.url = myURL;
        // fetch.source_name = source_name;
        fetch.source_encoding = myEncoding;
        fetch.crawltime = new Date();

        // 如果没有keywords, 就用source_name
        fetch.keywords = keywords_format == "" ? source_name : eval(keywords_format);

        fetch.title = title_format == "" ? "" :  eval(title_format);

        // 上传日期
        fetch.publish_date = "";
        if (date_format != "") {
            fetch.publish_date = eval(date_format);
        }
        // console.log('date: ' + fetch.publish_date);

        try {
            fetch.publish_date = regExp.exec(fetch.publish_date)[0];
        } catch (e) {
            console.log('获取发布时间出错：' + e);
        }

        //fetch.author = author_format == "" ? source_name : eval(author_format);
        fetch.author = "澎湃新闻";
        // 内容去除作者信息
        fetch.content = content_format == "" ? "" : eval(content_format).replace("\r\n" + fetch.author, "");

        //fetch.source = source_format == "" ? fetch.source_name : eval(source_format).replace("\r\n", "");
        fetch.source_name = "澎湃新闻";
        // console.log(fetch.keywords);
        var fetch_url_sql = 'select url from fetches where url=?';
        var fetch_url_sql_Params = [myURL];
        mysql.query(fetch_url_sql, fetch_url_sql_Params, function(qerr, vals, fields){
            if (vals.length > 0) {
                console.log('URL duplicate');
            } else {
                var fetchAddSql = 'INSERT INTO fetches(url,source_name,source_encoding,title,' +
                    'keywords,author,publish_date,crawltime,content) VALUES(?,?,?,?,?,?,?,?,?)';
                var fetchAddSql_Params = [fetch.url, fetch.source_name, fetch.source_encoding,
                    fetch.title, fetch.keywords, fetch.author, fetch.publish_date,
                    fetch.crawltime, fetch.content
                ];
                // console.log(fetchAddSql_Params);
                // 执行sql，数据库中fetch表里的url属性是unique的，不会把重复的url内容写入数据库
                mysql.query(fetchAddSql, fetchAddSql_Params, function(qerr, vals, fields) {
                    if (qerr) {
                        console.log(qerr);
                    }
                }); // mysql写入
            }
        })

        // var fetchAddSql = 'INSERT INTO fetches(url,source_name,source_encoding,title,' +
        //             'keywords,author,publish_date,crawltime,content) VALUES(?,?,?,?,?,?,?,?,?)';

        // var fetchAddSql_Params = [fetch.url, fetch.source_name, fetch.source_encoding,
        //                 fetch.title, fetch.keywords, fetch.author, fetch.publish_date,
        //                 fetch.crawltime, fetch.content
        // ];
        // sqlite.insert(fetchAddSql, fetchAddSql_Params);
    })
}