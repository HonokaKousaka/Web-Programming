var mysql = require("mysql");
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'crawl',
    connecTimeout:500,    //超时
    connectionLimit:100   //最大连接数
});
var query = function(sql, sqlparam, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            //conn.release(); //释放连接 
            callback(err, null, null);
        } else {
            conn.query(sql, sqlparam, function(qerr, vals, fields) {
                //conn.release(); //释放连接 
                callback(qerr, vals, fields); //事件驱动回调 
            });
        }
        //conn.release(); //释放连接 not work！
        pool.releaseConnection(conn); //
    });
};
var query_noparam = function(sql, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            conn.release(); //释放连接 
            callback(err, null, null);
        } else {
            conn.query(sql, function(qerr, vals, fields) {
                conn.release(); //释放连接 
                callback(qerr, vals, fields); //事件驱动回调 
            });
        }
    });
};
exports.query = query;
exports.query_noparam = query_noparam;