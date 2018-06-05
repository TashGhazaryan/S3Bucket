const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.update({ region: 'us-west-2' });

s3 = new AWS.S3({ apiVersion: '2006-03-01' });



module.exports.list = (event, ctx, callback) => {
    s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error", err);
            callback(null, { statusCOde: 400, body: JSON.stringify({ obj: err }) })
        } else {
            console.log("Bucket List", data.Buckets);
            callback(null, { statusCOde: 200, body: JSON.stringify({ obj: data }) })
        }
    });
}

module.exports.upld = (event, ctx, callback) => {
    const obj = JSON.parse(fs.readFileSync('test.json', 'utf8'));
    const stream = fs.createReadStream('./test.json');
    var uploadParams = { Bucket: 'node-json-file', Key: 'json', Body: stream };
    s3.upload(uploadParams, (err, data) => {
        if (err) {
            console.log("Error", err);
            callback(err);
        } else {
            console.log("Bucket List", data.Buckets);
            callback(null, { statusCOde: 200, body: JSON.stringify({ obj: data.Location }) })
        }
    });
}
module.exports.get = (event, ctx, callback) => {
    var test;    
    var bucketParams = { Bucket: 'node-json-file' };
    var uploadParams = { Bucket: 'node-json-file', Key: 'test'};
    s3.getObject(uploadParams, (err, data) => {
        if (err) {
            console.log("Error", err);
            callback(err);
        } else {
            callback(null, { statusCode: 200, body: data.Body.toString('utf8') })
        }
    });
}