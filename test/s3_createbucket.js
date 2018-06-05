// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});

// Create the parameters for calling createBucket
var bucketParams = {
   Bucket : "my-first-test0bucket"
};            

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
                                   
// Call S3 to create the bucket
s3.createBucket(bucketParams, function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log("Success", data.Location);
   }
});