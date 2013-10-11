/*global describe:false, it:false, beforeEach:false*/
define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai'], function (_, chai, Squire, mocha, sinon, sinonChai) {

    'use strict';
    var injector = new Squire(),
        should = chai.should(),
        expect = chai.expect;


    require(['underscore', 'sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');


    describe("An instance MasseuseModel", function () {


        //-----------Setup-----------
        var Model,
            ModelNoEvents,
            modelInstance,
            modelNoEventsInstance,
            ComputedProperty,
            ProxyProperty;

        beforeEach(function (done) {
            var afterDone = _.after(3, done);
            injector.require(['computedProperty'], function (Computed) {
                    ComputedProperty = Computed;
                    afterDone();
                },
                function () {
                    console.log('Computed error.')
                });
            injector.require(['proxyProperty'], function (Proxy) {
                    ProxyProperty = Proxy;
                    afterDone();
                },
                function () {
                    console.log('Proxy error.')
                });
            injector.require(['masseuseModel'], function (MasseuseModel) {
                    Model = MasseuseModel;
                    modelInstance = new Model();
                    afterDone();
                },
                function () {
                    console.log('Model error.')
                });
        });

        //-----------Tests-----------
        it("should exist", function () {
            should.exist(Model);
        });

        describe("set method (preserved original functionality) ", function () {


            it("should exist", function () {
                should.exist(Model.prototype.set);
            });

            it("should allow the user to set a single property", function () {
                modelInstance.set("propA", "something");
                should.exist(modelInstance.get("propA"));
                modelInstance.get("propA").should.equal("something");
            });

            it("should allow the user to set multiple properties at once", function () {
                modelInstance.set({
                    "propA": "something",
                    "propB": "somethingElse"
                });

                modelInstance.get("propA").should.equal("something");
                modelInstance.get("propB").should.equal("somethingElse");
            });

            it("should allow the user to pass in an options object when setting a single property", function () {
                var listenerFired = false;

                modelInstance.on("change", function () {
                    listenerFired = true;
                });

                modelInstance.set("propA", "something", { silent:true });

                listenerFired.should.be.false;
            });

            it("should allow the user to pass in an options object when setting multiple properties", function () {
                var listenerFired = false;

                modelInstance.on("change", function () {
                    listenerFired = true;
                });

                modelInstance.set({
                    "propA": "something",
                    "propB": "somethingElse"
                }, {silent:true});

                listenerFired.should.be.false;
            });
        });

        describe("ComputedProperty", function() {
            it("should allow the user to use a computed property when setting a single model property", function () {
                modelInstance.set("propA", 5);
                modelInstance.set("propB", ComputedProperty(["propA"], function (propA) {
                    return propA * 2;
                }));

                should.exist(modelInstance.get("propB"));
                modelInstance.get("propB").should.equal(10);
            });

            it("should allow the user to use a computed property when setting a single model property", function () {
                modelInstance.set({
                    "propB": ComputedProperty(["propA"], function (propA) {
                        return propA * 2;
                    }),
                    "propA": 5
                });

                should.exist(modelInstance.get("propB"));
                modelInstance.get("propB").should.equal(10);
            });

            it("should change the value of a computed property when a dependecy changes", function () {
                modelInstance.set({
                    "propB": ComputedProperty(["propA"], function (propA) {
                        return propA * 2;
                    }),
                    "propA": 5
                });

                should.exist(modelInstance.get("propB"));
                modelInstance.get("propB").should.equal(10);

                modelInstance.set("propA", 6);
                modelInstance.get("propB").should.equal(12);
            });

            it("should update computed properties when they are computed off of more than one property", function () {
                modelInstance.set({
                    "propA": 5,
                    "propB": 5,
                    "propC": ComputedProperty(["propA", "propB"], function (propA, propB) {
                        return propA + propB
                    })
                });

                modelInstance.get("propC").should.equal(10);

                modelInstance.set("propA", 6);

                modelInstance.get('propC').should.equal(11);

                modelInstance.set("propB", 6);

                modelInstance.get("propC").should.equal(12);

                modelInstance.set({
                    "propA": 7,
                    "propB": 7
                });

                modelInstance.get("propC").should.equal(14);
            });

            it("should update multiple computed properties off of the same property", function () {
                modelInstance.set({
                    "propA": 5,
                    "propB": ComputedProperty(["propA"], function (propA) {
                        return propA;
                    }),
                    "propC": ComputedProperty(["propA"], function (propA) {
                        return propA;
                    })
                });

                modelInstance.get('propB').should.equal(5);
                modelInstance.get('propC').should.equal(5);

                modelInstance.set('propA', 10);

                modelInstance.get('propB').should.equal(10);
                modelInstance.get('propC').should.equal(10);
            });

            it("should not set the initial computed value if 3rd paremeter is true", function() {
                modelInstance.set({
                    "propA": 5,
                    "propB": 5,
                    "propC": ComputedProperty(["propA", "propB"], function (propA, propB) {
                        return propA + propB
                    }, true)
                });

                modelInstance.get('propA').should.equal(5);
                modelInstance.get('propB').should.equal(5);
                should.not.exist(modelInstance.get('propC'));
                modelInstance.set('propA', 6);
                modelInstance.get('propC').should.equal(11);
                modelInstance.set('propB', 7);
                modelInstance.get('propC').should.equal(13);
            });

            it("should be able to set computed values on instantiation", function() {
                modelInstance = new Model({
                    "propA": 5,
                    "propB": 5,
                    "propC": ComputedProperty(["propA", "propB"], function (propA, propB) {
                        return propA + propB
                    })});

                modelInstance.get('propA').should.equal(5);
                modelInstance.get('propB').should.equal(5);
                modelInstance.get('propC').should.equal(10);
            })
        });

        xdescribe("speed test", function() {
            beforeEach(function(done) {
                injector.require(['masseuseModel'], function (MasseuseModel) {
                        ModelNoEvents = MasseuseModel;
                        modelNoEventsInstance = new ModelNoEvents();
                        done();
                    },
                    function () {
                        console.log('Model error.')
                    });
            });

            it("no events model is faster", function() {
                var start, finish, time, i = 0, loops = 100000;
                modelInstance.set("propB", ComputedProperty(["propA"], function (propA) {
                    return propA * 2;
                }));
                modelNoEventsInstance.set("propB", ComputedProperty(["propA"], function (propA) {
                    return propA * 2;
                }));

                modelInstance.set("propC", ComputedProperty(["propB"], function (propA) {
                    return propA * .25;
                }));
                modelNoEventsInstance.set("propC", ComputedProperty(["propB"], function (propA) {
                    return propA * .25;
                }));

                start = new Date().getTime();
                while(i < loops) {
                    modelNoEventsInstance.set('propA', ++i);
                }
                finish = new Date().getTime();
                time = finish - start;

                i = 0;
                start = new Date().getTime();
                while(i < loops) {
                    modelInstance.set('propA', ++i);
                }
                finish = new Date().getTime();

                console.log("---")
                console.log(time - (finish - start));
                expect(true).to.be.true;

                console.log("---")
                expect(time < finish - start).to.be.true;

                console.log(modelInstance.attributes);
                console.log(modelNoEventsInstance.attributes);

            });
        });

        describe("ProxyProperty", function() {
            var otherModel;

            beforeEach(function() {
                otherModel = new Model({
                    name : 'Jack'
                });
            });

            it("should allow the user to see changes of a property on another model", function() {

                modelInstance.set('nameProxy', ProxyProperty('name', otherModel));
                modelInstance.get('nameProxy').should.equal('Jack');

                otherModel.set('name', 'Jill');
                modelInstance.get('nameProxy').should.equal('Jill');
            });
        });

    });

});
