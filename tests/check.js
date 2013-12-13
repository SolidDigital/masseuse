define(['underscore'], function(_) {
    'use strict';
    return check;

    function check(method, tests) {
        _.each(tests, function(theTest) {
            //it(theTest[0] + ' should be: ' + theTest[1], function() {
            method(theTest[0]).should.equal(theTest[1]);
            //});
        });
    }
});