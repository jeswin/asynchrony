(function() {

    "use strict";

    var assert = require('assert');
    var asynchrony = require("../lib/asynchrony");

    describe("Asynchrony", function() {

        //Get tweets for a handle
        var getTweetsFor = asynchrony(function(name) {
            return new Promise(function(resolve, reject) {
                if (name === "jeswin") {
                    setTimeout(function() {
                        resolve(["Tweet1:t.co/666", "Tweet2:t.co/667"]);
                    }, 500);
                } else {
                    reject("Unknown user");
                }
            });
        });

        //Find urls in a tweet
        var parseTweetsForUrls = asynchrony(function(tweets) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    var urls = tweets.map(function(tweet) {
                        return tweet.split(":")[1];
                    });
                    resolve(urls);
                }, 100);
            });
        });

        //Expand a url using twitters api
        var expandUrlUsingTwitterApi = asynchrony(function(url) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve("example.com/" + url);
                }, 100);
            });
        });

        //fetch via http
        var httpGet = asynchrony(function(url) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve("Lorem ipsum dolor....");
                }, 100);
            });
        });


        it("print the final result", function(done) {
            //Get jeswin's tweets
            var tweets = getTweetsFor("jeswin");

            //get urls in tweets
            var shortUrls = parseTweetsForUrls(tweets);

            //expand the last shorturl
            var mostRecentShortUrl = asynchrony(function(shortUrls) {
                var mostRecentShortUrl = shortUrls[0];
                return expandUrlUsingTwitterApi(mostRecentShortUrl);
            })(shortUrls);

            //get the response body
            var responseBody = httpGet(mostRecentShortUrl);

            //check the response
            responseBody.then(function(resp) {
                assert.equal(resp, "Lorem ipsum dolor....");
                done();
            }).catch(function(err) {
                done(err);
            });
        });
    });

})();
