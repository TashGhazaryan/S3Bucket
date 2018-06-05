'use strict'
const AWS = require('aws-sdk');
const request = require('request');

AWS.config.update({ region: 'us-west-2' });
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

function failTest(event, ctx, callback) {
    const params = {
        Body: event.body,
        Key: "exampleobject.json"
    };
    s3.putObject(params, (err, data) => {
        if (err) {
            callback(null, { statusCode: 400, body: { msg: err } });
        } else {
            callback(null, { statusCode: 200, body: { msg: data } })
        }
    });
};

function putToS3(event, ctx, callback) {
    const params = {
        Body: event.body,
        Bucket: "node-json-file",
        Key: "exampleobject.json"
    };

    s3.putObject(params, (err, data) => {
        if (err) {
            console.log("Error during data upload from endpoint " + event.path);
            callback(null, { statusCode: 400, body: { msg: err } });
        } else {
            console.log("Data uploaded successfully from endpoint " + event.path);
            callback(null, { statusCode: 200, body: { msg: data } })
        }
    });
};

module.exports.main = (event, ctx, callback) => {
    //putToS3(event, ctx, callback);
    failTest(event, ctx, callback);
};

module.exports.sec1 = (event, ctx, callback) => {
    putToS3(event, ctx, callback);
    //failTest(event, ctx, callback);
};

module.exports.sec2 = (event, ctx, callback) => {
    putToS3(event, ctx, callback);
    //failTest(event, ctx, callback);
};