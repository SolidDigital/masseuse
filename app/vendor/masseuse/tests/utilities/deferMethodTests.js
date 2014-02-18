define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', '../../app/utilities/deferMethod', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, deferMethod) {

        'use strict';

        chai.should();

        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('deferMethod', function() {

            it('a deferred method returns a promise', function() {
                var promise = deferMethod(function() {}).closure();
                isPromise(promise);
            });

            describe('arguments', function() {
                var spy;

                beforeEach(function() {
                    spy = sinon.spy();

                    deferMethod(spy).closure(1,2);
                });

                it('the first argument passed into a deferred method is a deferred', function() {

                    deferMethod(spy).closure(1,2);
                    isDeferred(spy.args[0][0]);
                });

                it('the subsequent arguments passed into a deferred method are the arguments it is called with',
                    function() {
                        deferMethod(spy).closure(1,2);

                        spy.args[0][1].should.equal(1);
                        spy.args[0][2].should.equal(2);
                    });
            });

            it('resolving the deferred passed into a deferredMethod resolve its promise', function(done) {
                var spy = sinon.spy,
                    $deferred;
                deferMethod(function($def) {
                    $deferred = $def;
                }).closure().done(function() {
                    done();
                });
                spy.should.not.have.been.called;
                $deferred.resolve();
            });
        });

        function isPromise(promise) {
            _.isObject(promise).should.be.true;
            _.isFunction(promise.done).should.be.true;
            _.isFunction(promise.reject).should.be.false;
        }

        function isDeferred(deferred) {
            _.isObject(deferred).should.be.true;
            _.isFunction(deferred.done).should.be.true;
            _.isFunction(deferred.reject).should.be.true;
        }
    });
