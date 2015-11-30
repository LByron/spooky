# Example of [SpookyJS](https://github.com/SpookyJS/SpookyJS) usage

This example show how someone could use SpookyJS to web crawl or to test
a web page using SpookyJs. In the present example, the ratings from an iTunes application are extracted. This is overkill for a simple static page, see the [iTunesRatingScraper](https://github.com/axypas/iTunesRatingScraper) for a much faster results.

## Install
	npm install

	You also need to have installed:
		- phantomJs > 1.9.x
		- casperJs

	and verify the correct installation by taping in a console:
		phantomJs -v

## Run

	node app '<URL>'

