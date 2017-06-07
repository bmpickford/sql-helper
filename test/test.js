'use strict';

var sql = require('../lib/main');

/** CHANGE THESE DETAILS TO YOUR DB DETAILS **/
var username = 'user';
var password = '******';
var host = 'localhost';
var db = 'test';
var table = 'test';

setup(function(){
  insert(1, function(){
    update();
    selectOne();
    insert(2, function(){
      insert(3, function(){
        selectMany();
        del();
      });
    });
  });
});



function setup(callback){
  sql.setup(username, password, host, db, function(result){
    console.log('Setup result: ' + result['msg']);
    var fields = 'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(10)';
    sql.dropTable(table, function(result){
      sql.createTable(table, fields, function(result){
        console.log('Create table result: ' + result['msg']);
        callback();
      });
    });
  });
}

function insert(id, callback){
  sql.persist('INSERT INTO ' + table + ' VALUES (?, ?)', [id, 'testing'], function(result){
    console.log('Insert Result: ' + result['msg']);
    callback();
  });
}

function update(){
  sql.persist('UPDATE ' + table + ' SET name = ?', ['updated'], function(result){
    console.log('Update Result: ' + result['msg']);
  });
}

function del(){
  sql.persist('DELETE FROM ' + table + ' ', [1, 'testing'], function(result){
    console.log('Delete Result: ' + result['msg']);
    sql.dropTable(table, function(result){
      console.log('Drop table result: ' + result['msg']);
    });
  });
}

function selectOne(){
  sql.get('SELECT * FROM ' + table + ' ', [], function(result){
    console.log('Select one result: ' + result['msg']);
  });
}

function selectMany(){
  sql.get('SELECT * FROM ' + table + ' ', [], function(result){
    console.log('Select many result: ' + result['msg']);
  });
}
