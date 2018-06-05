'use strict'
const AWS = require('aws-sdk');
const request = require('request');
const async = require('async');

AWS.config.update({ region: 'us-west-2' });
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

function Endpoint(path, isMain) {
    this.path = path;
    this.isMain = isMain;
};

const BASE_URL = process.env.base_url;
let endpoints = [
    new Endpoint('/main', true),
    new Endpoint('/sec1', false),
    new Endpoint('/sec2', false)
];
let asyncTasks = [];
let errInMain = false;
let mainEndpointErrors = [];

module.exports.send = (event, ctx, callback) => {
    let options = {
        url: '',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: event.body
    };

    endpoints.forEach((endpoint) => {
        asyncTasks.push((cb) => {
            options.url = BASE_URL + endpoint.path;
            request(options, (error, response, body) => {
                if (error) return cb(error);
                if (endpoint.isMain && response.statusCode === 400) {
                    const endpointErr = {
                        endpoint: endpoint.path,
                        error: JSON.parse(body)
                    }
                    //errInMain = true;
                    mainEndpointErrors.push(endpointErr);
                }
                cb(null, body);
            });
        });
    });

    async.parallel(asyncTasks, function (err, results) {
        if (err)
            return callback(null, { statusCode: 400, body: { error: err } });
        if (mainEndpointErrors.length !== 0)
            return callback(null, { statusCode: 400, body: { error: mainEndpointErrors } });

        callback(null, { statusCode: 200, body: { msg: "Success!" } });
    });
};