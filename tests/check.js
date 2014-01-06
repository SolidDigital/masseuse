define(['underscore'], function (_) {
    'use strict';
    return check;

    /**
     * A row test helper.
     * @param method
     * @param tests
     */
    function check (method, tests) {
        _.each(tests, function (theTest) {
            var assertion = theTest.pop();
            method.apply(method, theTest).should.deep.equal(assertion);
        });
    }
});