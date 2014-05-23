define(['underscore','chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';

        chai.should();
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('ObserverProperty', function() {
            //-----------Setup-----------
            var Model,
                modelInstance,
                ObserverProperty,
                otherModel;

            beforeEach(function () {
                ObserverProperty = masseuse.ObserverProperty;
                Model = masseuse.MasseuseModel;
                modelInstance = new Model();
                otherModel = new Model();
                otherModel.set('name', 'Jack');
                otherModel.set('nestedName', {
                    name: 'DanteAleghieri',
                    subNestedName: {
                        b: 'DanteAleghieri'
                    }
                });
            });

            it('should allow the user to see changes of a property on another model', function() {
                modelInstance.set('nameProxy', new ObserverProperty('name', otherModel));
                modelInstance.get('nameProxy').should.equal('Jack');


                otherModel.set('name', 'Jill');
                modelInstance.get('nameProxy').should.equal('Jill');
            });

            it('should not allow the user to see changes of another model on the current model', function() {

                modelInstance.set('nameProxy', new ObserverProperty('name', otherModel));
                otherModel.get('name').should.equal('Jack');
                modelInstance.set('nameProxy', 'George');
                otherModel.get('name').should.equal('Jack');

            });
        });


    });
