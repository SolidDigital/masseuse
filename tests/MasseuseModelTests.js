/*global describe:false, it:false, beforeEach:false*/
define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai'], function (_, chai, Squire, mocha, sinon, sinonChai) {

    'use strict';
    var injector = new Squire(),
        should = chai.should();


    require(['underscore', 'sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');


    describe("An instance MasseuseModel", function () {


        //-----------Setup-----------
        var Model,
            modelInstance;

        beforeEach(function (done) {
            injector.require(['MasseuseModel'], function (MasseuseModel) {
                    Model = MasseuseModel;
                    modelInstance = new Model();
                    done();
                },
                function () {
                    console.log('Model error.')
                });
        });

        //-----------Tests-----------
        it("should exist", function () {
            should.exist(Model);
        });

        describe("set method", function () {
            var ComputedProperty;

            beforeEach(function (done) {
                injector.require(['ComputedProperty'], function (Computed) {
                        ComputedProperty = Computed;
                        done();
                    },
                    function () {
                        console.log('Computed error.')
                    });
            });

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
        });

    });

});
