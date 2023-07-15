var express = require('express');
var router = express.Router();
var mysql = require('../mysql.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/process_get', function(request, response) {
  var searchType = request.query.type;
  var searchText = request.query.query;
  var sortType = request.query.sort;

  var fetchSql = "SELECT title, source_name, url, publish_date, keywords FROM ecnu WHERE ";

  if (searchType === 'title') {
    fetchSql += "title LIKE '%" + searchText + "%'";
  } else if (searchType === 'content') {
    fetchSql += "content LIKE '%" + searchText + "%'";
  } else if (searchType === 'keywords') {
    fetchSql += "keywords LIKE '%" + searchText + "%'";
  }

  // 添加排序条件
  if (sortType === 'date') {
    fetchSql += " ORDER BY publish_date DESC";
  } else if (sortType === 'title') {
    fetchSql += " ORDER BY title";
  }

  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

router.get('/process_complex_query', function(request, response) {
  var searchText1 = request.query.searchText1;
  var searchType1 = request.query.searchType1;
  var searchText2 = request.query.searchText2;
  var searchType2 = request.query.searchType2;

  // 构造查询语句
  var fetchSql = "SELECT title, source_name, url, publish_date, keywords FROM ecnu WHERE ";
  fetchSql += searchType1 + " LIKE '%" + searchText1 + "%' AND " + searchType2 + " LIKE '%" + searchText2 + "%'";

  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

module.exports = router;