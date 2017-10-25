var Spooky = require('spooky');
process.env.PHANTOMJS_EXECUTABLE = 'node_modules/phantomjs/lib/phantom/bin/phantomjs';



var url ='https://itunes.apple.com/us/app/facebook/id284882215?mt=8&v0=';


var spooky = new Spooky({
        child: {
            command: "node_modules/casperjs/bin/casperjs",
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

        spooky.then(function getStatus(response){
            //this.emit('display','status:'+ JSON.stringify(response));
            this.emit('display','status:'+ response.status);

        });

        spooky.run();
	
	
    });




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
