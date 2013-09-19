/*global describe:false, it:false, beforeEach:false*/
define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai'], function (_, chai, Squire, mocha, sinon, sinonChai) {

    'use strict';
    var injector = new Squire(),
        should = chai.should();

    require(['underscore', 'sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');

    describe("Deferred State Machine Factory", function() {
        var stateMachine,
            obj,
            options;

        beforeEach(function(done) {

            obj = function() {
                return {
                    walkThrough: function() {},
                    lock: function() {},
                    unlock: function() {},
                    openDoor: function() {},
                    closeDoor: function() {},
                    kickDown: function() {}
                }
            };

            options = {
                open: function() {
                    return {
                        allowedMethods: [
                            this.walkThrough, this.closeDoor
                        ],
                        allowedTransitions: [
                            this.options.shut
                        ]
                    }
                },
                shut: function() {
                    return {
                        allowedMethods: [
                            this.lock, this.openDoor
                        ],
                        allowedTransitions: [
                            this.options.open, this.options.destroyed
                        ]
                    }
                },
                locked: function() {
                    return {
                        allowedMethods: [
                            this.unlock, this.kickDown
                        ],
                        allowedTransitions: [
                            this.options.shut, this.options.destroyed
                        ]
                    }
                },
                destroyed: function() {
                    return {
                        // End state
                    }
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
    })
});