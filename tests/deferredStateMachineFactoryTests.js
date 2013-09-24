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

    describe('The Deferred State Machine Factory', function() {
        var FSMFactory,
            stateMachine,
            obj,
            states,
            methodNames = [
                'walkThrough',
                'lock',
                'openDoor',
                'closeDoor',
                'kickDown'
            ];

        beforeEach(function(done) {

            obj = {
                    walkThrough: function() {},
                    lock: function() {},
                    unlock: function() {},
                    openDoor: function() { console.log('openDoor'); },
                    closeDoor: function(a) { console.log('closeDoor: ' + a); },
                    kickDown: function() {}
            };

            states = {
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
                    stateMachine = factory(obj, states);
                    FSMFactory = factory;
                    done();
                },
                function () {
                    console.log('Squire error.');
                });
        });

        it('returns an object that is the original object', function() {
            stateMachine.should.equal(obj);
        });

        describe('returns an FSM. The Deferred State Machine', function() {
            describe('getStates method', function() {
                it('return an array of string representing the states in the passed in config', function() {
                    stateMachine.getStates().should.deep.equal([
                        'open', 'shut', 'locked', 'destroyed'
                    ]);
                });
                it('should correctly return the states of one FSM after a second one is created', function() {
                    var fsm2;

                    fsm2 = FSMFactory({}, {
                        'play': {},
                        'pause':{}
                    })
                    fsm2.getStates().should.deep.equal(['play', 'pause']);
                    stateMachine.getStates().should.deep.equal([
                        'open', 'shut', 'locked', 'destroyed'
                    ]);
                });
            });

            describe('getState method', function() {
                it('returns "undefined" after FSM initializiation', function() {
                    should.not.exist(stateMachine.getState());
                });
            });

            describe('transition method', function() {
                it('returns a promise', function() {
                    var transitionPromise = stateMachine.transition();
                    isAPromise(transitionPromise);
                });
                it('correctly changes the state of the FSM after a successful transition', function(done) {
                    stateMachine.transition('open').done(function() {
                        stateMachine.getState().should.equal('open');
                        done();
                    });
                });
                it('does not change the state of the FSM after a failed transition', function(done) {
                    stateMachine.transition('blargh').fail(function() {
                        should.not.exist(stateMachine.getState());
                        done();
                    });
                })
            });

            describe('methods described in the state options', function() {
                it('all return promises', function() {
                    _.forEach(methodNames, function(method) {
                        isAPromise(stateMachine[method]());
                    });
                });
                it('fail if they are not available in the current state', function(done) {
                     stateMachine.openDoor().fail(function() {
                         // cannot use done directly, since the fail is called with a string
                         done();
                     });
                });
                it('resolve if they are available in the current state', function(done) {
                    stateMachine.transition('open').done(function() {
                        stateMachine.closeDoor('now').done(function() {
                            done();
                        });
                    });
                });
                // Add test for arguments to methods and method calls after transitions
            });
        });
    });

    function isAPromise(promise) {
        var testFor, testAgainst;

        should.exist(promise);

        testFor = [promise.done, promise.fail, promise.progress, promise.then];
        testAgainst = [promise.resolve, promise.reject];

        _.forEach(testFor, function(method) {
            should.exist(method);
            method.should.be.a.Function;
        });
        _.forEach(testAgainst, function(method) {
            should.not.exist(method);
        });
    }
});