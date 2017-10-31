/*!
 */

'use strict';

/**
 * Module dependencies.
 */

var Sitemapper = require('sitemapper');
var _ = require('lodash');
var Promise = require('bluebird');
const request = require('superagent');
var promiseLimit = require('promise-limit')
var performance = require("performance-now");
var time_start = performance();



var sitemap = new Sitemapper();


module.exports = {getSitemapReport: getSitemapReport, getStatuses: getAllStatuses};


function getSitemapReport(url) {
    if(!url) return;

    return sitemap.fetch(url).then(function (res) {
        return getAllStatuses(res.sites);
    })
        .then(generateReport);
}


function getAllStatuses(sites){
        var indexes = _.range(sites.length);
        var limit = promiseLimit(100);
        return Promise.all(indexes.map((index) => {
            return limit(() => getStatus(sites[index]))
        }));


}

function generateReport(data) {
         var groupByStatus = _.groupBy(data, 'status');
         var result = _.reduce(groupByStatus, function(result, value, key) {
            result[key] = {
                count : value.length
            };
            return result;
        }, {});
        console.log(result);
        var time_finish = performance();
        console.log("It took " + (time_finish - time_start).toFixed(3) + "ms to complete ");
         return result;
}

function getStatus(url) {
    console.log('STARTED', url);
    return request.head(url)
        .then(function (res) {
            console.log('--- FINISHED OK', url, res.status);

            return {
                url : url,
                status : res.status
            }
        })
        .catch(function (error) {

            if(error.response) {
                console.log('--- FINISHED WITH ERROR', url, error.response.status);
                return {
                    url: url,
                    status: error.response.status
                }
            } else {
                console.log('xxx', url);
                console.log('error');
                console.log(error);
                return {
                    url : url,
                    status : 'UNKNOWN'
                }
            }
        });


}
