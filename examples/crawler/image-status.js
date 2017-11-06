var sitemap = require('../../lib/sitemap');
var crawler = require('../../lib/crawler');


function getStatuses(result) {
    return sitemap.getStatuses(result.images);
}

crawler.getImages('https://www.lego.com/en-us/')
    .then(getStatuses)
    .then(function (statuses) {
    console.log('STATUSES', statuses);
});