var performance = require("performance-now");
var time_start = performance();
var async = require("async");
var request_retry = require('requestretry');
var Sitemapper = require('sitemapper');
var _ = require('lodash');

var lookup_list = [];
var total_requests = 50;
for (var i = 0; i < total_requests; i++) {
    lookup_list.push(i);
}

var url ='https://www.lego.com/sitemaps/sitemapindex.xml';

var sitemap = new Sitemapper();

sitemap.fetch(url).then(function (res) {
     startHttpCalls(res.sites);
});

// startHttpCalls(['https://www.lego.com/en-us/service/device-guide/boost','https://www.lego.com/pt-br/videos/themes/architecture']);

function startHttpCalls(sites) {
    var i=0;
    async.map(sites, function (item, callback) {
            request_retry({
                    url: item,
                    maxAttempts: 1,
                    retryStrategy: customRetryStrategy,
                    delayStrategy: customDelayStrategy
                },
                function (error, response, body) {
                    console.log(i++ ,item);
                    if (!error) {

                        callback(null, {
                            url: item,
                            status: response.statusCode
                        });
                    } else {
                        callback(null, {
                            url: item,
                            status: 'UNKNOWN'
                        });
                    }
                });
        },
        function (err, results) {
            var time_finish = performance();
            console.log("It took " + (time_finish - time_start).toFixed(3) + "ms to complete ");

            if (!err) {
                getReport(results);
            } else {
                getReport(results);
                console.log("We had an error somewhere.");
            }
        });
}



function getReport(data) {
    var groupByStatus = _.groupBy(data, 'status');
    var result = _.reduce(groupByStatus, function(result, value, key) {
        result[key] = {
            count : value.length
        };
        return result;
    }, {});
    console.log(result);
    return result;
}

function customRetryStrategy(err, response, body){
    // retry the request if we had an error or if the response was a 'Bad Gateway'
    return err || response.statusCode === 502 || response.statusCode === 504;
}

function customDelayStrategy(err, response, body){
    // set delay of retry to a random number between 500 and 3500 ms
    return 20;
}