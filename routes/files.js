/**
 * Created by Choichanghyun on 2016. 6. 3..
 */
var express = require('express');
var s3= require('s3');
var formidable= require('formidable');
var fs= require('fs-extra');
var util = require('util');
var path =require('path');

/* GET users listing. */
var router = express.Router();

router.post('/files', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //res.end(util.inspect({fields: fields, files: files}));
        var params = {
            localFile: files.test.path,
            s3Params: {
                Bucket: "maestrotest2",
                Key: files.test.name,
                // other options supported by putObject, except Body and ContentLength.
                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            },
        };
        var uploader = client.uploadFile(params);
        uploader.on('error', function (err) {
            console.error("unable to upload:", err.stack);
        });
        uploader.on('progress', function () {
            console.log("progress", uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
        });
        uploader.on('end', function () {
            console.log("done uploading");
        });

        global.pool.getConnection(function (err, connection) {
            if (err) {
                //에러처리
            }
            var query = 'INSERT into test.test2 (imgurl) VALUES ("https://s3.amazonaws.com/maestrotest2/' + files.test.name + '");';
            connection.query(query, function (err, rows) {
                if (err) {
                    // 에러처리
                }
                connection.release();
            })
        });
    });
});


router.get('/', function(req, res, next) {

    res.render('files');
});
/**
 * Created by Choichanghyun on 2016. 6. 3..
 */
module.exports = router;