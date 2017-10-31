var sitemap = require('../../lib/sitemap');

sitemap.getSitemapReport('https://www.lego.com/sitemaps/sitemapindex.xml').then(function (report) {
    console.log('REPORT', report);
});