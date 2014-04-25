define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';
        var should = chai.should();


        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('masseuse package', function() {
            _.each([
                'View',
                'ViewContext',
                'Model',
                'Collection',
                'Router',
                'ComputedProperty',
                'ProxyProperty',
                'ObserverProperty',
                'channels'
            ], function(property) {
                it('masseuse.'+property+' should exist', function() {
                    should.exist(masseuse[property]);
                });
            });
        });
    });
