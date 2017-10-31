var crawler = require('../../lib/crawler');

crawler.getErros('https://www.slideshare.net/jonwaller0/testing-with-nodejs').then(function(result){
    console.log('errors', result);
});