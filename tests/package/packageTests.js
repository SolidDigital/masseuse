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

            describe('aliases - these will be removed in 3.0.0', function() {
                _.each([
                    ['BaseView', 'View'],
                    ['MasseuseModel', 'Model'],
                    ['MasseuseRouter', 'Router']
                ], function(alias) {
                    it('masseuse.'+alias[0]+' should be an alias to masseuse.'+alias[1],
                        function() {
                            masseuse[alias[0]].should.equal(masseuse[alias[1]]);
                        });
                });

                it('masseuse.utilities.channels should be an alias to masseuse.channels',
                    function() {
                        masseuse.utilities.channels.should.equal(masseuse.channels);
                    });
            });
        });
    });
