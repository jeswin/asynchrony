(function() {
    "use strict";

    var slice = Array.prototype.slice;

    module.exports = function(fn) {
        return function() {
            var args = slice.call(arguments, 0).map(function(arg) {
                return arg instanceof Promise ? arg : Promise.resolve(arg);
            });
            var promise = Promise.all(args).then(function(values) {
                return fn.apply(null, values);
            });
            return promise;
        };
    };

})();
