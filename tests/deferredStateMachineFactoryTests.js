/*global describe:false, it:false, beforeEach:false*/
define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai'], function (_, chai, Squire, mocha, sinon, sinonChai) {

    'use strict';
    var injector = new Squire(),
        should = chai.should();

    require(['underscore', 'sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');
    mocha.stacktrace = true;

    describe("Deferred State Machine Factory", function() {
        var stateMachine,
            obj,
            options;

        beforeEach(function(done) {

            obj = {
                    walkThrough: function() {},
                    lock: function() {},
                    unlock: function() {},
                    openDoor: function() {},
                    closeDoor: function() {},
                    kickDown: function() {}
            };

            this.options = {
                open: {
                        allowedMethods: [
                           'walkThrough', 'closeDoor'
                        ],
                        allowedTransitions: [
                            'shut'
                        ]
                    },

                shut: {
                        allowedMethods: [
                            'lock', 'openDoor'
                        ],
                        allowedTransitions: [
                            'open', 'destroyed'
                        ]
                    },
                locked: {
                        allowedMethods: [
                            'unlock', 'kickDown'
                        ],
                        allowedTransitions: [
                            'shut', 'destroyed'
                        ]
                    },
                destroyed: {
                        // End state
                    }
            };

            injector.require(['deferredStateMachineFactory'], function (factory) {
                    stateMachine = factory(obj, options);
                    done();
                },
                function () {
                    console.log('Squire error.');
                });
        });

        it("returns an object", function() {
            should.exist(stateMachine);
        });

        it("returns an object that is the original object", function() {
            stateMachine.should.equal(obj);
            console.log(obj);
        });

        it("transition returns a promise", function() {
            var transition = stateMachine.transition();
            transition.should.be.a.Function;
        });
    })
});