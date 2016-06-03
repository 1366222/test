var express = require('express');
var s3= require('s3');
var formidable= require('formidable');
var fs= require('fs-extra');
var util = require('util');
var path =require('path');

/* GET users listing. */
var router = express.Router();

global.client = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
        accessKeyId: "AKIAJUCH6NF2PDO6BYGA",
        secretAccessKey: "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",
        // any other options are passed to new AWS.S3()
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    },
});



router.get('/', function(req, res, next) {
    res.render('files');
});


router.post('/', function (req, res) {
    console.log("sd");
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

        var params = {
            localFile: files.test.path,
            s3Params: {
                Bucket: "maestrotest2",
                Key: files.test.name,
                // other options supported by putObject, except Body and ContentLength.
                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            },
        };
        console.log(files.test.name);
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
    res.render('index');
});


module.exports = router;