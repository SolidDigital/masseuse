define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'backbone', 'masseuse', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, Backbone, masseuse) {

        'use strict';
        var should = chai.should();


        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');


        describe('An instance of MasseuseModel', function () {


            //-----------Setup-----------
            var Model,
                modelInstance,
                ComputedProperty,
                ProxyProperty;

            beforeEach(function () {
                ComputedProperty = masseuse.ComputedProperty;
                ProxyProperty = masseuse.ProxyProperty;
                Model = masseuse.MasseuseModel;
                modelInstance = new Model();
            });

            //-----------Tests-----------
            it('should exist', function () {
                should.exist(Model);
            });

            describe('set method', function () {
                describe('(preserved original functionality) ', function () {


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

                    it('should allow the user to pass in an options object when setting multiple properties',
                        function () {
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

                describe('(setting nested fields)', function () {
                    it('should set a nested field on a model', function () {
                        modelInstance.set('nestedProperty.subProperty', 'JohnyDeepNested');
                        modelInstance.get('nestedProperty').subProperty.should.equal('JohnyDeepNested');
                    });
                    it('should set a nested field on a model even if intermediate fields are models', function () {
                        var nested = new Model({title : 'new'});
                        modelInstance.set('nestedProperty', nested);
                        modelInstance.set('nestedProperty.title', 'blah');
                        should.equal(nested instanceof Backbone.Model, true);
                        modelInstance.attributes.nestedProperty.attributes.title.should.equal('blah');
                        should.not.exist(modelInstance.attributes.nestedProperty.title);

                    });
                    it('should fire a change event on the top level property when setting a nested attribute',
                        function () {
                            var listener = _.extend({}, Backbone.Events),
                                callback = sinon.spy();

                            modelInstance.set('nestedName.name', 'PapaEmeritus');

                            listener.listenTo(modelInstance, 'change:nestedName', callback);

                            modelInstance.set('nestedName.name', 'PopeGandolfi');

                            callback.should.have.been.calledOnce;
                        });
                });

                describe('(getting nested fields)', function () {
                    it('should get a nested field on a model', function () {
                        modelInstance.set('nestedProperty', {subProperty : 'JohnnyDeepNested'});
                        modelInstance.get('nestedProperty.subProperty').should.equal('JohnnyDeepNested');
                    });

                    it('should return undefined if that property does not exist', function () {
                        modelInstance.set('nestedProperty', {});
                        should.equal(modelInstance.get('nestedProperty.subProperty'), undefined);
                    });

                    it('should get a nested field on a model even if intermediate fields are models', function () {
                        var nested = new Model({title : 'test'});
                        modelInstance.set('nestedProperty', nested);
                        modelInstance.get('nestedProperty.title').should.equal('test');
                    });
                });
            });

            describe('unset method', function () {
                it('regular property', function () {
                    var model = new Model({a : 1, b : 2});
                    model.get('a').should.equal(1);
                    model.get('b').should.equal(2);
                    model.unset('a');
                    should.not.exist(model.get('a'));
                });
                it('nested property', function () {
                    var model = new Model({
                        a : {
                            b : 1,
                            c : 2
                        }
                    });

                    model.get('a.b').should.equal(1);
                    model.get('a.c').should.equal(2);
                    model.unset('a.b');
                    should.not.exist(model.get('a.b'));
                    model.get('a.c').should.equal(2);
                });
                it('nested model', function () {
                    var model = new Model({
                        a : new Model({
                            b : 1,
                            c : 2
                        })
                    });

                    model.get('a.b').should.equal(1);
                    model.get('a.c').should.equal(2);
                    model.unset('a.b');
                    should.not.exist(model.get('a.b'));
                    model.get('a.c').should.equal(2);
                });
            });

            describe('nested models', function () {
                var nestedModel;
                beforeEach(function () {
                    nestedModel = new Model();
                    modelInstance.set('nested', nestedModel);
                });
                it('changing a value on a nested model should trigger a change event on the parent model',
                    function (done) {
                        modelInstance.on('change', done.bind(null, undefined));
                        nestedModel.set('test', 'test');

                    });
                it('changing a value on a deeply nested model should trigger a change event on the parent model',
                    function (done) {
                        var deepModel = new Model();
                        modelInstance.set('nestedModel.one.two', deepModel);
                        modelInstance.get('nestedModel.one.two').should.equal(deepModel);
                        modelInstance.set('nestedModel.one.two.three.four', deepModel);
                        modelInstance.on('change', _.once(done.bind(null, undefined)));
                        deepModel.set('boom', 'shakalaka');
                    });
            });
        });
    });
