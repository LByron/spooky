/*!
 */

'use strict';

/**
 * Module dependencies.
 */

var Spooky = require('spooky');
var Promise = require('bluebird');
var _ = require('lodash');
process.env.PHANTOMJS_EXECUTABLE = '../../node_modules/phantomjs/lib/phantom/bin/phantomjs';


module.exports = {getImages: getImages, getErros: getErros};


function getErros(url) {
    return new Promise(function (resolve, reject) {
        crawlForErros(url, resolve, reject);
    });
}


function crawlForErros(url, resolve, reject) {
    if(!url) {reject(); return;};

    if(typeof(url) === 'undefined'){

        console.error("No url to fetch, please check the example above.");
        process.exit();
    }

    console.log("The url to get errors fetched from is: '"+url+"'");
    if(!url){
        console.error('Sorry, not valid url');
        process.exit();
    }



    var spooky = new Spooky({
        child: {
            command: "../../node_modules/casperjs/bin/casperjs",
            transport: 'http'
        },
        casper: {
            exitOnError: false,
            onResourceRequested: function(msg,trace) {
                this.emit('display', JSON.stringify({msg: msg, trace: trace, title: this.getHTML()}));
            },
            onError: function(msg,trace) {
                this.emit('display', JSON.stringify({msg: msg, trace: trace, title: this.getHTML()}));
            },
            verbose: true
        }
    }, function (err) {
        if (err) {
            var e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.start(url);


        spooky.then(function(){
            // this.on("log.message", function(msg, trace) {
            //         this.capture('itune'+new Date()+'.png');
            // });

            this.on("remote.message", function(msg) {this.capture('itune'+new Date()+'.png');});
            this.on("page.error", function(){this.capture('itune'+new Date()+'.png');});
            this.on('error', function(e){this.capture('itune'+new Date()+'.png');});
        });


        spooky.waitFor(function check() {
            return this.evaluate(function() {
                return document.querySelectorAll('body').length > 0;
            });
        }, function then() {





//
// // http://docs.casperjs.org/en/latest/events-filters.html#remote-message
//             this.on("remote.message", function(msg) {
//                 this.emit('display', JSON.stringify(msg));
//             });
//
// // http://docs.casperjs.org/en/latest/events-filters.html#page-error
//             this.on("page.error", function(msg, trace) {
//                 this.emit('display', JSON.stringify(msg));
//                 // maybe make it a little fancier with the code from the PhantomJS equivalent
//             });



        }, function timeout() { // step to execute if check has failed
            this.echo("Sorry, it took to much time to fetch the images, try later or check if the url is correct.").exit();
        });




        spooky.run();


    });



    spooky.on('error', function (e, stack) {
        console.error(e);

        if (stack) {
            console.log(stack);
        }
        reject();
    });

    spooky.on('display', function (text) {
        console.log(text);
        //resolve(JSON.parse(text));
    });

    spooky.on('log', function (log) {
        if (log.space === 'remote') {
            console.log(log.message.replace(/ \- .*/, ''));
        }
    });
}























function getImages(url) {
    return new Promise(function (resolve, reject) {
        crawlForImages(url, resolve, reject);
    });
}


function crawlForImages(url, resolve, reject) {
    if(!url) {reject(); return;};

    if(typeof(url) === 'undefined'){

        console.error("No url to fetch, please check the example above.");
        process.exit();
    }

    console.log("The url to get images fetched from is: '"+url+"'");
    if(!url){
        console.error('Sorry, not valid url');
        process.exit();
    }



    var spooky = new Spooky({
        child: {
            command: "../../node_modules/casperjs/bin/casperjs",
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            var e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.start(url);




        spooky.waitFor(function check() {
            return this.evaluate(function() {
                return document.querySelectorAll('body').length > 0;
            });
        }, function then() {

            var result = this.evaluate(function(toto) {
                var images = document.getElementsByTagName('img');

                var result = {toto:'xxx', resultCount : images.length, images : _.map(images, 'src')}

                return result;

            });


            this.emit('display', JSON.stringify(result));



        }, function timeout() { // step to execute if check has failed
            this.echo("Sorry, it took to much time to fetch the images, try later or check if the url is correct.").exit();
        });

        spooky.run();


    });


    spooky.on('console', function (line) {
        console.log(line);
    });


    spooky.on('error', function (e, stack) {
        console.error(e);

        if (stack) {
            console.log(stack);
        }
        reject();
    });

    spooky.on('display', function (text) {
        resolve(JSON.parse(text));
    });

    spooky.on('log', function (log) {
        if (log.space === 'remote') {
            console.log(log.message.replace(/ \- .*/, ''));
        }
    });
}



