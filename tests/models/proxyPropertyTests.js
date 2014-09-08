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

        // TODO: test that from to can be in to from order too
        // TODO: update proxy prop documentation
        // TODO: test for deep nesting both to and from
        it('should allow the user to see changes of a property on another model', function() {
            modelInstance.setProxy('nameProxy').from('name', otherModel);
            modelInstance.get('nameProxy').should.equal('Jack');


            otherModel.set('name', 'Jill');
            modelInstance.get('nameProxy').should.equal('Jill');
        });

        it('should allow the user to see changes of another model on the current model', function() {

            modelInstance.setProxy('nameProxy').from('name', otherModel);
            otherModel.get('name').should.equal('Jack');
            modelInstance.set('nameProxy', 'George');
            otherModel.get('name').should.equal('George');

        });

        it('should allow the user to set nested ProxyProperties', function() {
            modelInstance.setProxy('nameProxy').from('nestedName.name', otherModel);
            modelInstance.get('nameProxy').should.equal('DanteAleghieri');
        });

        it('should allow the user to set nested to ProxyProperties', function() {
            modelInstance.setProxy('nested.property').from('nestedName.name', otherModel);
            modelInstance.attributes.nested.property.should.equal('DanteAleghieri');
        });

        it('should allow the user to see changes on nested ProxyProperties from the proxy', function() {
            modelInstance.setProxy('nameProxy').from('nestedName.subNestedName.b', otherModel);
            modelInstance.get('nameProxy').should.equal('DanteAleghieri');
            otherModel.get('nestedName').subNestedName.b.should.equal('DanteAleghieri');
            otherModel.set('nestedName.subNestedName.b', 'DanBrown');
            otherModel.get('nestedName').subNestedName.b.should.equal('DanBrown');
            modelInstance.get('nameProxy').should.equal('DanBrown');
        });

        it('should allow the user to see changes on the original proxy from the proxied property', function() {
            modelInstance.setProxy('nameProxy').from('nestedName.subNestedName.b', otherModel);
            modelInstance.get('nameProxy').should.equal('DanteAleghieri');
            modelInstance.set('nameProxy', 'DanBrown');
            otherModel.get('nestedName').subNestedName.b.should.equal('DanBrown');
        });

        it('should create the property on the original proxy when the proxied property is set, ' +
            'if the original did not exist', function() {
            modelInstance.setProxy('nameProxy').from('nonExistingProperty', otherModel);
            modelInstance.set('nameProxy', 'DanBrown');
            otherModel.get('nonExistingProperty').should.equal('DanBrown');
        });

        it('should create the property on the original proxy when the nested proxied property is set, ' +
            'if the original did not exist', function() {
            modelInstance.setProxy('nameProxy').from('nonExistingProperty.nestedNonExistingProperty', otherModel);

            modelInstance.set('nameProxy', 'DanBrown');
            otherModel.get('nonExistingProperty').nestedNonExistingProperty.should.equal('DanBrown');
        });
    });


});
