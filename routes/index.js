var express = require('express');
var s3= require('s3');
var formidable= require('formidable');
var fs= require('fs-extra');
var util = require('util');
var path =require('path');
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

  res.render('index', { title: 'Express' });
});


router.post('/index', function (req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {

    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));

    console.log(files.openedFiles[0].path);
    form.on('end', function(fields, files) {
      /* Temporary location of our uploaded file */
      var temp_path = files.openedFiles[0].path;
      /* The file name of the uploaded file */
      var file_name = files.openedFiles[0].name;
      /* Location where we want to copy the uploaded file */
      var new_location = 'c:/localhost/nodejs/';

      console.log(temp_path);
      fs.copy(temp_path, new_location + file_name, function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log("success!")
        }
      });
    });
    /*
    var params = {
      localFile: "/Users/Choichanghyun/Desktop/3-1/os.jpeg",

      s3Params: {
        Bucket: "maestrotest2",
        Key: "test",
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      },
    };

     var uploader = client.uploadFile(params);
     uploader.on('error', function(err) {
     console.error("unable to upload:", err.stack);
     });
     uploader.on('progress', function() {
     console.log("progress", uploader.progressMd5Amount,
     uploader.progressAmount, uploader.progressTotal);
     });
     uploader.on('end', function() {
     console.log("done uploading");
     });
     */
  });

});
module.exports = router;
