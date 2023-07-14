var source_name = "华东师范大学";
var myEncoding = "utf-8";
var base_URL = 'https://www.ecnu.edu.cn/xwlm/xwrd';
var news_URL = 'https://www.ecnu.edu.cn/';

var seedURL_format = "$('a')";
var keywords_format = " $('META[Name=\"keywords\"]').eq(0).attr(\"content\")";
var title_format = "$('title').text()";
var date_format = "$('.m3ninfo').text()";
// var author_format = "$('meta[name=\"author\"]').eq(0).attr(\"content\")";
var content_format = "$('.v_news_content').text()";
// var desc_format = " $('META[Name=\"description\"]').eq(1).attr(\"content\")";
// var source_format = "$('.post_author').text()";
var url_reg = /\/info\/(\d{4})\/(\d{5}).htm/;
var regExp = /\d{4}年\d{2}月\d{2}日/;

var fs = require('fs');
var myRequest = require('request');
var myCheerio = require('cheerio');
var myIconv = require('iconv-lite');
var mysql = require('./mysql.js');
var schedule = require('node-schedule');
require('date-utils');

//防止网站屏蔽我们的爬虫
var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() - start < delay) {
        continue;
    }
}

//request模块异步ecnu url
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

// var rule = new schedule.RecurrenceRule();
// var times = [8,13,20];
// var times2 = [30,31,35,36,37];
// rule.hour = times;
// rule.minute = times2;

// schedule.scheduleJob(rule, function() {
//     seedget();
// })

// function seedget() {
    for (var i = 0; i <= 15; i++)
    {
        if (i === 0)
        seedURL = base_URL + ".htm";
        else
        {
            seedURL = base_URL + "/" + String(1294-i) + ".htm";
        }
        // console.log(seedURL);
        request(seedURL, function(err, res, body) { //读取种子页面
            try {
            //用iconv转换编码
            var html = myIconv.decode(body, myEncoding);
            // console.log(seedURL);
            // console.log(html);
            //准备用cheerio解析html
            var $ = myCheerio.load(html, { decodeEntities: true });
            } catch (e) { console.log('读种子页面并转码出错：' + e) };

            var seedurl_news;

            try {
                seedurl_news = eval(seedURL_format);
                // console.log(seedurl_news);
            } catch (e) { console.log('url列表所处的html块识别出错：' + e) };
            try {
                seedurl_news.each(function(i, e) { //遍历种子页面里所有的a链接
                    var myURL = "";
                    try {
                        //得到具体新闻url
                        var href = "";
                        href = $(e).attr("href");
                        if (href == undefined) {
                            return; 
                        }
                        // if (href && (href.toLowerCase().indexOf('http://') >= 0 || href.toLowerCase().indexOf('https://') >= 0))
                        //     myURL = href; //http://开头的
                        //     else if (href && href.startsWith('//')) myURL = 'https:' + href; ////开头的
                        // else myURL = seedURL.substr(0, seedURL.lastIndexOf('/') + 1) + href; //其他
                        if (href && href.startsWith('../../info/'))
                        {
                            myURL = news_URL + href.substr(6);
                            // console.log(myURL);
                        }
                        else if (href && href.startsWith('../info/'))
                        {
                            myURL = news_URL + href.substr(3);
                        }
                    } catch (e) { console.log('识别种子页面中的新闻链接出错：' + e) }

                    if (!url_reg.test(myURL)) return; //检验是否符合新闻url的正则表达式
                    // console.log(myURL);
                    var ecnu_url_Sql = 'select url from ecnu where url=?';
                    var ecnu_url_Sql_Params = [myURL];
                    mysql.query(ecnu_url_Sql, ecnu_url_Sql_Params, function(qerr, vals, fields) {
                        if (vals.length > 0) {
                            console.log('URL duplicate!')
                        }
                        else newsGet(myURL);
                    })
                });
            }
            catch (e) {
                console.log(e);
            };
        });
    };
// }

function newsGet(myURL) { //读取新闻页面
    request(myURL, function(err, res, body) { //读取新闻页面
        try {
        // console.log(myURL);
        var html_news = myIconv.decode(body, myEncoding); //用iconv转换编码
        //console.log(html_news);
        //准备用cheerio解析html_news
        var $ = myCheerio.load(html_news, { decodeEntities: true });
        } catch (e) {
            console.log('读新闻页面并转码出错：' + e);
            return 0;
        };

        console.log("转码读取成功:" + myURL);
        //动态执行format字符串，构建json对象准备写入文件或数据库
        var ecnu = {};
        ecnu.title = "";
        ecnu.content = "";
        ecnu.publish_date = (new Date()).toFormat("YYYY-MM-DD");
        //ecnu.html = myhtml;
        ecnu.url = myURL;
        ecnu.source_name = source_name;
        ecnu.source_encoding = myEncoding; //编码
        ecnu.crawltime = new Date();

        if (keywords_format == "") ecnu.keywords = source_name; // eval(keywords_format);  //没有关键词就用sourcename
        else ecnu.keywords = eval(keywords_format);//.trim();

        if (title_format == "") ecnu.title = ""
        else ecnu.title = eval(title_format).trim(); //标题

        if (date_format != "") ecnu.publish_date = eval(date_format); //刊登日期   
        // console.log('date: ' + ecnu.publish_date);
        try {
            ecnu.publish_date = regExp.exec(ecnu.publish_date)[0];
            ecnu.publish_date = ecnu.publish_date.replace('年',"-");
            ecnu.publish_date = ecnu.publish_date.replace('月',"-");
            ecnu.publish_date = ecnu.publish_date.replace('日',"");
            console.log(ecnu.publish_date);
        } catch (e) {
            // console.log(e);
        }
        finally {
            // console.log(ecnu.publish_date);
            // ecnu.publish_date = new Date(ecnu.publish_date).toFormat("YYYY-MM-DD");
        };
        // if (date_format != "") ecnu.publish_date = eval(date_format).trim();

        // if (author_format == "") ecnu.author = source_name; //eval(author_format);  //作者
        // else ecnu.author = eval(author_format).trim();

        if (content_format == "") ecnu.content = "";
        // else ecnu.content = eval(content_format).replace("\r\n" + ecnu.author, ""); //内容,是否要去掉作者信息自行决定
        else ecnu.content = eval(content_format).trim();

        // if (source_format == "") ecnu.source = ecnu.source_name;
        // // else ecnu.source = eval(source_format).replace("\r\n", ""); //来源
        // else ecnu.source = eval(source_format).trim();

        // if (desc_format == "") ecnu.desc = ecnu.title;
        // else if (eval(desc_format) != undefined) ecnu.desc = eval(desc_format).trim(); //摘要  
        // else ecnu.desc = eval(desc_format);  

        // var filename = source_name + "_" + (new Date()).toFormat("YYYY-MM-DD") +
        //     "_" + myURL.substr(myURL.lastIndexOf('/') + 1, 5) + ".json";
        // ////存储json
        // fs.writeFileSync(filename, JSON.stringify(ecnu));
        var ecnuAddSql = 'INSERT INTO ecnu(url,source_name,source_encoding,title,' +
            'keywords,publish_date,crawltime,content) VALUES(?,?,?,?,?,?,?,?)';
        var ecnuAddSql_Params = [ecnu.url, ecnu.source_name, ecnu.source_encoding,
            ecnu.title, ecnu.keywords, ecnu.publish_date,
            ecnu.crawltime.toFormat("YYYY-MM-DD HH24:MI:SS"), ecnu.content
        ];

        //执行sql，数据库中ecnu表里的url属性是unique的，不会把重复的url内容写入数据库
        mysql.query(ecnuAddSql, ecnuAddSql_Params, function(qerr, vals, fields) {
            if (qerr) {
                console.log(qerr);
            }
        });
        sleep(500);
    });
}