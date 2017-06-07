## sql-helper

Simple simplifier for using SQL with Node JS

### Getting started
To start, you need to provide the username, password, host and database
```javascript
var sql = require('sql-helper');

sql.setup('root', '*******', 'localhost', 'testDB', function(result){
  console.log(result['msg]);
});
```
All callback results are in the JSON format of {'action':'fail/success', 'msg':'message here', 'data':JSON of reuturned rows if any}


### Usage
The function used are:
```javascript
get(query, params, callback)
persist(query, params, callback)
createTable(tableName, fields, callback)
dropTable(tableName,callback)
```
Get is used for retrieving data, and will return an array of results if more than one column is found, otherwise a single json if only one result is found

Persist is used for update/insert/delete statement and will return the ID of the updated field if relevant

### Example
test.js is a good reference, and can be run from the root folder by running
```node ./test/test.js```

However, you will need to edit your database details from lines 6-10 for it to run

You will also need to create the database 'test' or change the db variable to a database that you have already created
