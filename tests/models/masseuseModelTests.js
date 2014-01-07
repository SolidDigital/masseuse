define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai', 'sinonSpy'],
    function (_, chai, Squire, mocha, sinon, sinonChai) {

        'use strict';
        var injector = new Squire(),
            should = chai.should();


        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');


        describe('An instance of MasseuseModel', function () {


            //-----------Setup-----------
            var Model,
                modelInstance,
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
                        done();
                    });
            });

            //-----------Tests-----------
            it('should exist', function () {
                should.exist(Model);
            });

            describe('set method (preserved original functionality) ', function () {


                it('should exist', function () {
                    should.exist(Model.prototype.set);
                });

                it('should allow the user to set a single property', function () {
                    modelInstance.set('propA', 'something');
                    should.exist(modelInstance.get('propA'));
                    modelInstance.get('propA').should.equal('something');
                });

                it('should allow the user to set multiple properties at once', function () {
                    modelInstance.set({
                        'propA' : 'something',
                        'propB' : 'somethingElse'
                    });

                    modelInstance.get('propA').should.equal('something');
                    modelInstance.get('propB').should.equal('somethingElse');
                });

                it('should allow the user to pass in an options object when setting a single property', function () {
                    var listenerFired = false;

                    modelInstance.on('change', function () {
                        listenerFired = true;
                    });

                    modelInstance.set('propA', 'something', { silent : true });

                    listenerFired.should.be.false;
                });

                it('should allow the user to pass in an options object when setting multiple properties', function () {
                    var listenerFired = false;

                    modelInstance.on('change', function () {
                        listenerFired = true;
                    });

                    modelInstance.set({
                        'propA' : 'something',
                        'propB' : 'somethingElse'
                    }, {silent : true});

                    listenerFired.should.be.false;
                });
            });
        });
    });
