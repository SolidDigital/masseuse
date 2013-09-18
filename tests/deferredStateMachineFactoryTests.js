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
            stateOptions;

        beforeEach(function(done) {

            obj = {
                walkThrough: function() {},
                lock: function() {},
                unlock: function() {},
                openDoor: function() {},
                closeDoor: function() {},
                kickDown: function() {}
            };

            stateOptions = {
                open: {
                    allowedMethods: [
                        obj.walkThrough, obj.closeDoor
                    ],
                    allowedTransitions: [
                        'shut'
                    ]
                },
                shut: {
                    allowedMethods: [
                        obj.lock, obj.openDoor
                    ],
                    allowedTransitions: [
                        'open', 'destroyed'
                    ]
                },
                locked: {
                    allowedMethods: [
                        obj.unlock, obj.kickDown()
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
                    stateMachine = factory(obj, stateOptions);
                    done();
                },
                function () {
                    console.log('Squire error.')
                });
        });

        it("returns an object", function() {
            should.exist(stateMachine);
        });
    })
});