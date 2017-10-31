var crawler = require('../../lib/crawler');

crawler.getImages('https://www.lego.com/en-us/').then(function(result){
    console.log('IMAGES', result);
});