var express = require('express');

/* GET users listing. */
var router = express.Router();
router.get('/', function(req, res, next) {

  console.log("sd");
  // 1. 디비에서 글 목록을 가져온다
  global.pool.getConnection(function(err, connection) {
    if (err) {
      //에러처리
    }
    var query = 'SELECT imgurl FROM test.test2';
    connection.query(query, function(err, rows) {
      if (err) {
        // 에러처리
      }

      connection.release();
      res.render('users', {img: rows})
      console.log(rows);
    })
  });

});
//조우경 바보야
module.exports = router;
