var mysql = require('mysql');

var connectInfo = {};

exports.setup = function(user, pwd, host, db, callback){
  connectInfo['user'] = user;
  connectInfo['password'] = pwd;
  connectInfo['host'] = host;
  connectInfo['database'] = db;
  if(!connectInfo['user'] || !connectInfo['password'] || !connectInfo['host'] || !connectInfo['database']){
    callback({'action':'fail', 'msg':'Missing connection info. Make sure setup has been called with username, password, host and database'});
  } else {
    callback({'action':'success', 'msg':'Successful setup'});
  }
}


exports.get = function(query, params, callback){
  dbQuery(query, params, 'get', function(result){
    callback(result);
  });
}

exports.persist = function(query, params, callback){
  dbQuery(query, params, 'persist', function(result){
    callback(result);
  });
}

exports.createTable = function(name, cols, callback){
  var query = "CREATE TABLE " + name + '(' + cols + ');';
  tableEdit(query, function(result){
    callback(result);
  });
}

exports.dropTable = function(name, callback){
  var query = "DROP TABLE IF EXISTS " + name;
  tableEdit(query, function(result){
    callback(result);
  });
}

function dbQuery(query, params, method, callback){
  if(!connectInfo['user'] || !connectInfo['password'] || !connectInfo['host'] || !connectInfo['database']){
    callback({'action':'fail', 'msg':'Missing connection info. Make sure setup has been called with username, password, host and database'});
  }
  var client = mysql.createConnection(connectInfo);
  client.connect(function(err) {
    if (err) {
      callback({'action':'fail', 'msg': 'DB connection issue: ' + err});
    } else {
      query = mysql.format(query, params);
      client.query(query, function(err, rows) {
        client.end();
        if (err) {
          callback({'action' : 'fail', 'msg' : 'SQL Execution Error: ' + err});
        } else {
          if(method === 'persist'){
            callback({'action' : 'success', 'msg' : 'Changes Saved', 'data':rows['insertId']});
          } else if (method === 'get'){
            if (rows.length === 0) {
              callback({'action':'success', 'msg':'No results found', 'data':rows});
            } else if (rows.length === 1){
              callback({'action' : 'success', 'msg' : 'Retrieved one row', 'data':rows[0]});
            } else {
              callback({'action' : 'success', 'msg' : 'Retrieved multiple rows', 'data':rows});
            }
          } else {
            callback({'action' : 'fail', 'msg' : method + ' is not a valid call to query', 'data':rows});
          }
        }
      });
    }
  });
};

function tableEdit(query, callback){
   if(!connectInfo['user'] || !connectInfo['password'] || !connectInfo['host'] || !connectInfo['database']){
    callback({'action':'fail', 'msg':'Missing connection info. Make sure setup has been called with username, password, host and database'});
  }
  var client = mysql.createConnection(connectInfo);
  client.connect(function(err) {
    if (err) {
      callback({'action':'fail', 'msg': 'DB connection issue: ' + err});
    } else {
      client.query(query, function(err, rows) {
        client.end();
        if (err) {
          callback({'action' : 'fail', 'msg' : 'SQL Execution Error: ' + err});
        } else {
          callback({'action' : 'success', 'msg' : 'Table change executed'});
        }
      });
    }
  });
}