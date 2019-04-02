const request = require('request');
const config = require('config');
const AWS = require("aws-sdk");

const s3Bucket = new AWS.S3({params: {Bucket: config.get("awsS3Bucket")}});

var s3 = {};

s3.upload = function(urlPathAndFileName, content) {
    return new Promise(function(resolve, reject) {
        console.log("Uploading to S3: " + urlPathAndFileName);
        s3Bucket.upload(
            {Key: urlPathAndFileName, Body: content},
            (err, data) => {
                if(err) {
                    console.log("Error while uploading to S3: " + urlPathAndFileName);
                    reject(err);
                } else {
                    console.log("Successfully uploaded to S3: " + urlPathAndFileName);
                    resolve(data);
                }
            }
        );
    });
};


s3.uploadMeta = function(fileName, content) {
    return this.upload(config.get("metaDataFilePath") + fileName, content);
};



module.exports = s3;