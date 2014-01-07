define(['underscore','chai', 'squire', 'mocha', 'sinon', 'sinonChai', 'sinonSpy'],
    function (_, chai, Squire, mocha, sinon, sinonChai) {

    'use strict';
    var injector = new Squire();

    chai.should();
    chai.use(sinonChai);
    mocha.setup('bdd');

    describe('ProxyProperty', function() {
        //-----------Setup-----------
        var Model,
            modelInstance,
            ProxyProperty,
            otherModel;

        beforeEach(function (done) {
            injector.require(['masseuse'], function (masseuse) {
                    ProxyProperty = masseuse.ProxyProperty;
                    Model = masseuse.MasseuseModel;
                    modelInstance = new Model();
                    otherModel = new Model();
                    otherModel.set('name', 'Jack');
                    done();
                },
                function () {
                    done();
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

        it('should allow the user to set multiple ProxyProperties at once', function() {
            modelInstance.set({
                'nameProxy': new ProxyProperty('name', otherModel),
                'nameProxy2': new ProxyProperty('name', otherModel)
            });
            modelInstance.get('nameProxy').should.equal('Jack');
            modelInstance.get('nameProxy2').should.equal('Jack');
        });
    });


});
