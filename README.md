# asynchrony
Asynchrony is a tiny function that unwraps Promises passed as arguments to functions.
Doing so saves you from "then hell", which is like callback hell, but slightly hotter.
This project is not a joke. Really.

Examples below to see how you can use asynchrony.

### Comparison with Promises Code

Code with asynchrony. See how functions are wrapped in asynchrony.
```
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

//See ma, no then()s!
var tweets = getTweetsFor("jeswin");
var shortUrls = parseTweetsForUrls(tweets);
var mostRecentShortUrl = asynchrony(function(shortUrls) {
    var mostRecentShortUrl = shortUrls[0];
    return expandUrlUsingTwitterApi(mostRecentShortUrl);
})(shortUrls);

var responseBody = httpGet(mostRecentShortUrl);
responseBody.then(function(resp) {
    console.log(resp);
});
```

Code without asynchrony.
```
/*
    Example taken from https://blog.domenic.me/youre-missing-the-point-of-promises/
    Implementation of getTweetsFor(), parseTweetsForUrls() etc removed for brevity
*/

getTweetsFor("domenic")
    .then(function (tweets) {
        var shortUrls = parseTweetsForUrls(tweets);
        var mostRecentShortUrl = shortUrls[0];
        return expandUrlUsingTwitterApi(mostRecentShortUrl); // promise-returning function
    })
    .then(httpGet) // promise-returning function
    .then(
        function (responseBody) {
            console.log("Most recent link text:", responseBody);
        },
        function (error) {
            console.error("Error with the twitterverse:", error);
        }
    );
```
