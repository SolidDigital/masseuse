define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', '../../app/utilities/createOptions', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, createOptions) {
        'use strict';

        chai.should();

        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('createOptions', function() {
            var defaultOptions,
                otherOptions,
                customOptions;

            beforeEach(function () {
                defaultOptions = {
                    defaultKey: 'defaultOptionsValue',
                    sharedKey: 'sharedValueInDefaultOptions'
                };
                otherOptions = {
                    otherKey: 'otherOptionsValue',
                    sharedKey: 'sharedValueInOtherOptions'
                };
                customOptions = {
                    customKey: 'customOptionValue',
                    sharedKey: 'sharedValueInCustomOption'
                };
            });

            it('should use the defaultOptions if view defines one and none is passed in', function() {
                var options = createOptions(defaultOptions, undefined);

                options.should.deep.equal(defaultOptions);
            });
            describe('extend', function() {
                it('should extend the default options with options that are passed in (if any)', function() {
                    var options = createOptions(defaultOptions, customOptions);

                    options.should.deep.equal({
                        defaultKey: 'defaultOptionsValue',
                        customKey: 'customOptionValue',
                        sharedKey: 'sharedValueInCustomOption'
                    });
                });
                it('should extend default modelData with passed in model data', function() {
                    var defaultOptions = {
                            modelData : {
                                default : 1
                            }
                        },
                        customOptions = {
                            modelData : {
                                extra : 2
                            }
                        },
                        options = createOptions(defaultOptions, customOptions);

                    options.should.deep.equal({
                        modelData : {
                            default : 1,
                            extra : 2
                        }
                    });
                });
                it('undefined values should shadow values even in nested properties', function() {
                    var defaultOptions = {
                            modelData : {
                                default : 1,
                                default2 : 1
                            }
                        },
                        customOptions = {
                            modelData : {
                                default : undefined,
                                default2 : 1,
                                extra : 2
                            }
                        },
                        options = createOptions(defaultOptions, customOptions);

                    options.should.deep.equal({
                        modelData : {
                            default : undefined,
                            default2 : 1,
                            extra : 2
                        }
                    });
                });
            });
            it('keys from the default options can be shadowed by options with keys of value undefined', function() {
                var options;
                otherOptions.defaultKey = undefined;
                options = createOptions(defaultOptions, otherOptions);
                options.should.deep.equal({
                    defaultKey: undefined,
                    otherKey: 'otherOptionsValue',
                    sharedKey: 'sharedValueInOtherOptions'
                });
            });
            // Checking for ignoring default optoins happens at the constructor level
            // test for it is in the BaseView tests
            describe('backwards compatibility with earlier versions requires that', function() {
                it('should have {} options if no defaultOptions and no options are given', function() {
                    var options = createOptions();

                    options.should.deep.equal({});
                });
                it('should use arguments as options if view does not define a defaultOptions', function() {
                    var options = createOptions(undefined, otherOptions);

                    options.should.deep.equal(otherOptions);
                });
            });
        });
    });
