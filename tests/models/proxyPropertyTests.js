define(['underscore','chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, masseuse) {

    'use strict';

    chai.should();
    chai.use(sinonChai);
    mocha.setup('bdd');

    describe('ProxyProperty', function() {
        //-----------Setup-----------
        var Model,
            modelInstance,
            ProxyProperty,
            otherModel;

        beforeEach(function () {
                ProxyProperty = masseuse.ProxyProperty;
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
            modelInstance.set('nameProxy', new ProxyProperty('name', otherModel));
            modelInstance.get('nameProxy').should.equal('Jack');


            otherModel.set('name', 'Jill');
            modelInstance.get('nameProxy').should.equal('Jill');
        });

        it('should allow the user to see changes of another model on the current model', function() {

            modelInstance.set('nameProxy', new ProxyProperty('name', otherModel));
            otherModel.get('name').should.equal('Jack');
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

        it('should allow the user to set nested ProxyProperties', function() {
            modelInstance.set('nameProxy', new ProxyProperty('nestedName.name', otherModel));
            modelInstance.get('nameProxy').should.equal('DanteAleghieri');
        });

        it('should allow the user to see changes on nested ProxyProperties from the proxy', function() {
            modelInstance.set('nameProxy', new ProxyProperty('nestedName.subNestedName.b', otherModel));
            modelInstance.get('nameProxy').should.equal('DanteAleghieri');
            otherModel.get('nestedName').subNestedName.b.should.equal('DanteAleghieri');
            otherModel.set('nestedName.subNestedName.b', 'DanBrown');
            otherModel.get('nestedName').subNestedName.b.should.equal('DanBrown');
            modelInstance.get('nameProxy').should.equal('DanBrown');
        });

        it('should allow the user to see changes on the original proxy from the proxied property', function() {
            modelInstance.set('nameProxy', new ProxyProperty('nestedName.subNestedName.b', otherModel));
            modelInstance.get('nameProxy').should.equal('DanteAleghieri');
            modelInstance.set('nameProxy', 'DanBrown');
            otherModel.get('nestedName').subNestedName.b.should.equal('DanBrown');
        });

        it('should create the property on the original proxy when the proxied property is set, ' +
            'if the original did not exist', function() {
            modelInstance.set('nameProxy', new ProxyProperty('nonExistingProperty', otherModel));
            modelInstance.set('nameProxy', 'DanBrown');
            otherModel.get('nonExistingProperty').should.equal('DanBrown');
        });

        it('should create the property on the original proxy when the nested proxied property is set, ' +
            'if the original did not exist', function() {
            modelInstance.set('nameProxy',
                new ProxyProperty('nonExistingProperty.nestedNonExistingProperty', otherModel));

            modelInstance.set('nameProxy', 'DanBrown');
            otherModel.get('nonExistingProperty').nestedNonExistingProperty.should.equal('DanBrown');
        });
    });


});
