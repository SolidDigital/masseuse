define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai'], function (_, chai, Squire, mocha, sinon, sinonChai) {
    'use strict';
    var injector = new Squire(),
        should = chai.should();

    require(['sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');

    describe('ViewContext', function() {

        var ViewContext;
        beforeEach(function(done) {
            injector.require(['masseuse'], function (masseuse) {
                    ViewContext = masseuse.ViewContext;
                    done();
                },
                function () {
                    console.log('BaseView error.');
                    done();
                });
        });

        it('binds correctly in simple case', function() {
            var config = {
                    name : new ViewContext('name')
                },
                person = {
                    name: 'bob'
                };

            config.name.getBoundFunction(person).should.equal('bob');
        });

        it('binds correctly with nested fields', function() {
            var config = {
                    last : new ViewContext('name.last')
                },
                person = {
                    name: {
                        first: 'bob',
                        last: 'bobertson'
                    }
                };

            config.last.getBoundFunction(person).should.equal('bobertson');
        });
    });
});