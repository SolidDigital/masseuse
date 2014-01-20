define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'squire', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, Squire) {
        'use strict';

        var injector = new Squire(),
            should = chai.should();

        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('OptionsFactory', function() {
            var OptionsFactory,
                defaultOptions = {
                    defaultOptionsKey: 'defaultOptionsValue',
                    sharedKey: 'sharedValueInDefaultOptions'
                },
                otherOptions = {
                    otherOptionsKey: 'otherOptionsValue',
                    sharedKey: 'sharedValueInOtherOptions'
                },
                customOptions = {
                    customOptionKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                };

            beforeEach(function (done) {
                injector.require(['../app/utilities/optionsFactory'], function (OptionsFactoryDep) {
                    OptionsFactory = OptionsFactoryDep;
                    done();
                });
            });

            it('should use the defaultOptions if view defines one and none is passed in', function() {
                var options = OptionsFactory(undefined, defaultOptions);

                options.should.deep.equal(defaultOptions);
            });
            it('should extend the default options with options that are passed in (if any)', function() {
                var options = OptionsFactory(customOptions, defaultOptions);

                options.should.deep.equal({
                    defaultOptionsKey: 'defaultOptionsValue',
                    customOptionKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                });
            });
            it('non-default options \\ should be accepted as option \\ but does not extend', function() {
                var options = OptionsFactory({
                    optionsOverride: otherOptions
                }, defaultOptions);

                options.should.deep.equal(otherOptions);
            });
            it('should allow custom options to extend an overridding non-default options', function() {
                var options = OptionsFactory(_.extend({}, customOptions, {
                    optionsOverride: otherOptions
                }), defaultOptions);

                options.should.deep.equal({
                    otherOptionsKey: 'otherOptionsValue',
                    customOptionKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                });
            });
            describe('backwards compatibility with earlier versions requires that', function() {
                it('should have undefined options if no defaultOptions and no options are given', function() {
                    var options = OptionsFactory(undefined, undefined);

                    should.equal(options, undefined);
                });
                it('should use arguments as options if view does not define a defaultOptions', function() {
                    var options = OptionsFactory(otherOptions, undefined);

                    options.should.deep.equal(otherOptions);
                });
            });
        });
    });
