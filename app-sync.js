var Sitemapper = require('sitemapper');
var _ = require('lodash');
var Promise = require('bluebird');
var axios = require('axios');
const request = require('superagent');



var url ='https://www.lego.com/sitemaps/sitemapindex.xml';

var sitemap = new Sitemapper();

sitemap.fetch(url).then(function (res) {
    //return getAllStatuses(['https://www.lego.com/nl-nl/products/by-age','https://www.lego.com/ja-jp/products/classifications'])
    return getAllStatuses(res.sites);
})
    .then(getReport).then(function (report) {
        //console.log(report);
});

function getAllStatuses(sites){
    // return _.reduce(sites, function(result, url, key) {
    //     result.push(getStatus(url))
    //     return result;
    // }, []);

        var data = [];
        getData(0);

        function getData(index) {
            getStatus(sites[index]).then(function(s) {
                data.push(s);
                if(index < sites.length - 1) {
                    console.log(index,sites[index]);
                    getData(index+1);
                }
                else {
                    //console.log(data);
                    getReport(data);
                }
            })
        }





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

function getStatus(url) {
    return request.get(url)
        .timeout({
            response: 10000,  // Wait 5 seconds for the server to start sending,
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
                console.log('error');
                console.log(error);
                return {
                    url : url,
                    status : 'UNKNOWN'
                }
            }
        });


}
