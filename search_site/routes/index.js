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

  var fetchSql = "SELECT title, source_name, url, author, publish_date FROM fetches WHERE ";

  if (searchType === 'title') {
    fetchSql += "title LIKE '%" + searchText + "%'";
  } else if (searchType === 'content') {
    fetchSql += "content LIKE '%" + searchText + "%'";
  } else if (searchType === 'keywords') {
    fetchSql += "keywords LIKE '%" + searchText + "%'";
  } else if (searchType === 'author') {
    fetchSql += "author LIKE '%" + searchText + "%'";
  }

  // 添加排序条件
  if (sortType === 'date') {
    fetchSql += " ORDER BY publish_date DESC";
  } else if (sortType === 'title') {
    fetchSql += " ORDER BY title";
  } else if (sortType === 'author') {
    fetchSql += " ORDER BY author";
  }

  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

module.exports = router;
