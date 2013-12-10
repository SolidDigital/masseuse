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
            injector.require(['masseuse'], function (masseuse) {
                    ComputedProperty = masseuse.ComputedProperty;
                    ProxyProperty = masseuse.ProxyProperty;
                    Model = masseuse.MasseuseModel;
                    modelInstance = new Model();
                    done();
                },
                function () {
                    console.log('Model error.');
                    done();
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

            it("should allow the user to see changes of another model on the current model", function() {

                modelInstance.set('nameProxy', ProxyProperty('name', otherModel));
                modelInstance.set('nameProxy', 'George');
                otherModel.get('name').should.equal('George');

            });

            it("should allow the user to set multiple ProxyProperteis at once", function() {
                modelInstance.set({
                    'nameProxy': ProxyProperty('name', otherModel),
                    'nameProxy2': ProxyProperty('name', otherModel)
                });
                modelInstance.get('nameProxy').should.equal('Jack');
                modelInstance.get('nameProxy2').should.equal('Jack');
            })
        });

    });

});
