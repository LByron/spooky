var Sitemapper = require('sitemapper');
var _ = require('lodash');
var Promise = require('bluebird');
var axios = require('axios');
const request = require('superagent');



var url ='https://www.lego.com/sitemaps/sitemapindex.xml';

var sitemap = new Sitemapper();

sitemap.fetch(url).then(function (res) {
    return getAllStatuses(res.sites.slice(0,300))
})
    .then(getReport).then(function (report) {
        console.log(report);
});

function getAllStatuses(sites){
    return _.reduce(sites, function(result, url, key) {
        result.push(getStatus(url))
        return result;
    }, []);
}

function getReport(statuses) {
    return Promise.all(statuses).then(function(response) {
         var groupByStatus = _.groupBy(response, 'status');
         return _.reduce(groupByStatus, function(result, value, key) {
            result[key] = {
                count : value.length
            };
            return result;
        }, {});
    });
}

function getStatus(url) {
    return request.get(url)
        .timeout({
            response: 5000,  // Wait 5 seconds for the server to start sending,
            deadline: 60000, // but allow 1 minute for the file to finish loading.
        })
        .then(function (res) {
            return {
                url : url,
                status : res.status
            }
        })
        .catch(function (error) {
            if(error.response) {
                return {
                    url: url,
                    status: error.response.status
                }
            } else {
                console.log('xxx', url);
                return {
                    url : url,
                    status : 'UNKNOWN'
                }
            }
        });


}
