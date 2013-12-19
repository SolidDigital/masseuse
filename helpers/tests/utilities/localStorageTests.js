define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai'],
    function (_, chai, mocha, sinon, sinonChai) {

        'use strict';
        var should = chai.should();

        //-------------To make JSHINT pass-------------
        should;

        require(['sinonCall', 'sinonSpy']);
        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('Local Storage', function() {
            it('NEEDS SOME TESTS', function() {

            });
        });
    });