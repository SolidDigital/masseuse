define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';
        var should = chai.should();


        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');


        describe('ComputedProperty', function () {

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

            it('should allow the user to use a computed property when setting a single model property', function () {
                modelInstance.set('propA', 5);
                modelInstance.set('propB', new ComputedProperty(['propA'], function (propA) {
                    return propA * 2;
                }));

                should.exist(modelInstance.get('propB'));
                modelInstance.get('propB').should.equal(10);
            });

            it('should allow the user to use a computed property when setting a single model property', function () {
                modelInstance.set({
                    'propB' : new ComputedProperty(['propA'], function (propA) {
                        return propA * 2;
                    }),
                    'propA' : 5
                });

                should.exist(modelInstance.get('propB'));
                modelInstance.get('propB').should.equal(10);
            });

            it('should change the value of a computed property when a dependency changes', function () {
                modelInstance.set({
                    'propB' : new ComputedProperty(['propA'], function (propA) {
                        return propA * 2;
                    }),
                    'propA' : 5
                });

                should.exist(modelInstance.get('propB'));
                modelInstance.get('propB').should.equal(10);

                modelInstance.set('propA', 6);
                modelInstance.get('propB').should.equal(12);
            });

            it('should update computed properties when they are computed off of more than one property', function () {
                modelInstance.set({
                    'propA' : 5,
                    'propB' : 5,
                    'propC' : new ComputedProperty(['propA', 'propB'], function (propA, propB) {
                        return propA + propB;
                    })
                });

                modelInstance.get('propC').should.equal(10);

                modelInstance.set('propA', 6);

                modelInstance.get('propC').should.equal(11);

                modelInstance.set('propB', 6);

                modelInstance.get('propC').should.equal(12);

                modelInstance.set({
                    'propA' : 7,
                    'propB' : 7
                });

                modelInstance.get('propC').should.equal(14);
            });

            it('should update multiple computed properties off of the same property', function () {
                modelInstance.set({
                    'propA' : 5,
                    'propB' : new ComputedProperty(['propA'], function (propA) {
                        return propA;
                    }),
                    'propC' : new ComputedProperty(['propA'], function (propA) {
                        return propA;
                    })
                });

                modelInstance.get('propB').should.equal(5);
                modelInstance.get('propC').should.equal(5);

                modelInstance.set('propA', 10);

                modelInstance.get('propB').should.equal(10);
                modelInstance.get('propC').should.equal(10);
            });

            it('should not set the initial computed value if 3rd paremeter is true', function () {
                modelInstance.set({
                    'propA' : 5,
                    'propB' : 5,
                    'propC' : new ComputedProperty(['propA', 'propB'], function (propA, propB) {
                        return propA + propB;
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

            it('should be able to set computed values on instantiation', function () {
                modelInstance = new Model({
                    'propA' : 5,
                    'propB' : 5,
                    'propC' : new ComputedProperty(['propA', 'propB'], function (propA, propB) {
                        return propA + propB;
                    })
                });

                modelInstance.get('propA').should.equal(5);
                modelInstance.get('propB').should.equal(5);
                modelInstance.get('propC').should.equal(10);
            });
        });
    });
