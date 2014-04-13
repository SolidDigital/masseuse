define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'backbone', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse, Backbone) {

        'use strict';

        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('masseuse.Collection', function() {
            it('should be an instance of Backbone.Collection', function() {
                new masseuse.Collection().should.be.instanceOf(Backbone.Collection);
            });
            it('should use masseuse.Model', function() {
                new masseuse.Collection([{}]).models[0].should.be.instanceOf(masseuse.Model);
            });
        });
    });
