define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'squire', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, Squire) {
        'use strict';

        var injector = new Squire(),
            should = chai.should();

        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('ConfigFactory', function() {
            var ConfigFactory,
                defaultConfig = {
                    defaultConfigKey: 'defaultConfigValue',
                    sharedKey: 'sharedValueInDefaultConfig'
                },
                otherConfig = {
                    otherConfigKey: 'otherConfigValue',
                    sharedKey: 'sharedValueInOtherConfig'
                },
                customOptions = {
                    customOptionKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                };

            beforeEach(function (done) {
                injector.require(['../app/utilities/configFactory'], function (ConfigFactoryDep) {
                    ConfigFactory = ConfigFactoryDep;
                    done();
                });
            });

            it('should use the defaultConfig if view defines one and none is passed in', function() {
                var config = ConfigFactory(undefined, defaultConfig);

                config.should.deep.equal(defaultConfig);
            });
            it('should extend the default config with options that are passed in (if any)', function() {
                var config = ConfigFactory(customOptions, defaultConfig);

                config.should.deep.equal({
                    defaultConfigKey: 'defaultConfigValue',
                    customOptionKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                });
            });
            it('non-default config \\ should be accepted as option \\ but does not extend', function() {
                var config = ConfigFactory({
                    config: otherConfig
                }, defaultConfig);

                config.should.deep.equal(otherConfig);
            });
            it('should allow custom options to extend an overridding non-default config', function() {
                var config = ConfigFactory(_.extend({}, customOptions, {
                    config: otherConfig
                }), defaultConfig);

                config.should.deep.equal({
                    otherConfigKey: 'otherConfigValue',
                    customOptionKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                });
            });
            describe('backwards compatibility with earlier versions requires that', function() {
                it('should have undefined options if no defaultConfig and no options are given', function() {
                    var config = ConfigFactory(undefined, undefined);

                    should.equal(config, undefined);
                });
                it('should use arguments as config if view does not define a defaultConfig', function() {
                    var config = ConfigFactory(otherConfig, undefined);

                    config.should.deep.equal(otherConfig);
                });
            });
        });
    });
