define(['../../../../../.', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai'], function (_, chai, Squire, mocha, sinon, sinonChai) {

    'use strict';
    var injector = new Squire(),
        should = chai.should(),
        expect = chai.expect;


    require(['sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');

    describe('ProxyProperty', function() {
        //-----------Setup-----------
        var Model,
            modelInstance,
            ComputedProperty,
            ProxyProperty,
            otherModel;

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

        beforeEach(function() {
            otherModel = new Model({
                name : 'Jack'
            });
        });

        it('should allow the user to see changes of a property on another model', function() {

            modelInstance.set('nameProxy', new ProxyProperty('name', otherModel));
            modelInstance.get('nameProxy').should.equal('Jack');

            otherModel.set('name', 'Jill');
            modelInstance.get('nameProxy').should.equal('Jill');
        });

        it('should allow the user to see changes of another model on the current model', function() {

            modelInstance.set('nameProxy', new ProxyProperty('name', otherModel));
            modelInstance.set('nameProxy', 'George');
            otherModel.get('name').should.equal('George');

        });

        it('should allow the user to set multiple ProxyProperteis at once', function() {
            modelInstance.set({
                'nameProxy': new ProxyProperty('name', otherModel),
                'nameProxy2': new ProxyProperty('name', otherModel)
            });
            modelInstance.get('nameProxy').should.equal('Jack');
            modelInstance.get('nameProxy2').should.equal('Jack');
        });
    });


});
