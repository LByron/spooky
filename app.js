var Spooky = require('spooky');

var ITUNES_URL = 'https://itunes.apple.com';

console.log();
console.log("*******************************************************");
console.log();
console.log("To find the ratings for an iTunes application, use the following:");
console.log("   node app.js <URL>")
console.log();
console.log("For example: ");
console.log("   node app.js 'https://itunes.apple.com/us/app/facebook/id284882215?mt=8&v0=' ");
console.log();
console.log("*******************************************************");
console.log("");

var url = process.argv[2];
if(typeof(url) === 'undefined'){
	
	console.error("No url to fetch, please check the example above.");
	process.exit();
}

console.log("The url to be fetched is: '"+url+"'");
if(url.length < ITUNES_URL.length || url.slice(0, ITUNES_URL.length) !== ITUNES_URL){
    console.error('Sorry, only itunes supported...');
    process.exit();
}


var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.start(url);

	spooky.then(function(){
	    // save a screenshot of the page, yeah it's Christmas soon!
	    this.capture('itune'+new Date()+'.png');
	});

	spooky.waitFor(function check() {
	    return this.evaluate(function() {
		return document.querySelectorAll('.customer-ratings').length > 0;
	    });
	}, function then() {

	    var result = this.evaluate(function(toto) {
		    var ratingsElt = document.getElementsByClassName('customer-ratings')[0];
		    //var currentVersionRating = ratingsElt.getElementsByClassName('rating')[0].getAttribute('aria-label').charAt(0);

	 	    var allVersionRating = ratingsElt.getElementsByClassName('rating')[1].getAttribute('aria-label').charAt(0);
		    var allVersionCount = ratingsElt.getElementsByClassName('rating-count')[1].textContent;

		    var regexpOnlyNumbers = new RegExp("[0-9]+","g");
		    var resultCount = allVersionCount.match(regexpOnlyNumbers)[0];
		    var result = {};
		    result.allVersionRating = allVersionRating;
		    result.resultCount = resultCount;

                    return result;
 	  
	   });
	   this.emit('display', 'star rating: '+result.allVersionRating);
	   this.emit('display', 'star rating count: '+result.resultCount);

	  
	   
	}, function timeout() { // step to execute if check has failed
	    this.echo("Sorry, it took to much time to fetch the rating, try later or check if the url is correct.").exit();
	});

        spooky.run();
	
	
    });


/*
// Uncomment this block to see all of the things Casper has to say.
// There are a lot.
// He has opinions.
spooky.on('console', function (line) {
    //console.log(line);
});
*/


spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
});

spooky.on('display', function (text) {
    console.log(text);
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});
