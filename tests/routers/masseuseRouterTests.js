/*
Tests:

    1) Create router w/o before routing
        a) Test that router method gets called
    2) Create router w/ beforeRouting
        a) Test that beforeRouting gets called first
        b) Test that router method gets called second
    3) Fail beforeRouting
        a) Test that router method does not get called
        b) Test that onRouteFail gets called
    4) Create excludeFromBeforeRouting
        a) Test that beforeRouting does not get called
        b) Test that router method gets called
 */
define(['chai', 'mocha', 'sinonChai'],
    function (chai, mocha, sinonChai) {
    'use strict';

    chai.should();
    chai.use(sinonChai);
    mocha.setup('bdd');

    describe('Masseuse Router', function () {

        describe('before routing', function () {
            // TODO: implement router tests
        });
    });
});
