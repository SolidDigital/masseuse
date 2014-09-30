define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'backbone', 'masseuse', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, Backbone, masseuse) {

        'use strict';

        chai.should();


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

            describe('nested models', function () {
                var nestedModel;
                beforeEach(function () {
                    nestedModel = new Model();
                    modelInstance.set('nested', nestedModel);
                });

                describe('with string keys', function() {
                    describe('propagated change events', function() {

                        // TODO: test for setting nested model with an object and not string key
                        it('changing a value on a nested model should trigger change events for each property changed and a generic change event on each model',
                            function() {
                                var parent = new Model(),
                                    child = new Model(),
                                    parentSpy = sinon.spy(),
                                    childSpy = sinon.spy();

                                parent.set('a.b', child);

                                child.on('all', childSpy);
                                parent.on('all', parentSpy);

                                child.set('c.d', true);

                                childSpy.callCount.should.equal(3);
                                childSpy.getCall(0).args[0].should.equal('change:c.d');
                                childSpy.getCall(1).args[0].should.equal('change:c');
                                childSpy.getCall(2).args[0].should.equal('change');

                                parentSpy.callCount.should.equal(5);
                                parentSpy.getCall(0).args[0].should.equal('change:a.b.c.d');
                                parentSpy.getCall(1).args[0].should.equal('change:a.b.c');
                                parentSpy.getCall(2).args[0].should.equal('change:a.b');
                                parentSpy.getCall(3).args[0].should.equal('change:a');
                                parentSpy.getCall(4).args[0].should.equal('change');

                            });
                        it('changing a value on a nested model should trigger a change event on the parent model',
                            function (done) {
                                modelInstance.on('change:nested.test', done.bind(null, undefined));
                                nestedModel.set('test', 'test');

                            });
                        it('changing a value on a deeply nested model should trigger a change event on the parent model', function (done) {
                            var deepModel = new Model();
                            modelInstance.set('nestedModel.one.two', deepModel);
                            modelInstance.get('nestedModel.one.two').should.equal(deepModel);
                            modelInstance.set('nestedModel.one.two.three.four', deepModel);
                            modelInstance.on('change:nestedModel.one.two.three.four', _.once(done.bind(null, undefined)));
                            deepModel.set('boom', 'shakalaka');
                        });
                    });
                });

                describe('with object keys', function() {
                    it('changing a value on a nested model should trigger change events for each property changed and a generic change event on each model', function() {
                        var parent = new Model(),
                            child = new Model(),
                            parentSpy = sinon.spy(),
                            childSpy = sinon.spy();

                        parent.set({
                            a : child
                        });


                        child.on('all', childSpy);
                        parent.on('all', parentSpy);

                        child.set('b.c', 4);

                        childSpy.callCount.should.equal(3);
                        childSpy.getCall(0).args[0].should.equal('change:b.c');
                        childSpy.getCall(1).args[0].should.equal('change:b');
                        childSpy.getCall(2).args[0].should.equal('change');

                        parentSpy.getCall(0).args[0].should.equal('change:a.b.c');
                    });
                });
            });
        });
    });
