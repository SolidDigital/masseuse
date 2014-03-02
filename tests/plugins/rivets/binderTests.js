define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';

        var testDom = 'testDom',
            $body = $('body'),
            $testDom,
            RivetView = masseuse.plugins.rivets.RivetsView,
            rivetView,
            options,
            templateWithAttribute,
            templateWithoutAttribute;

        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('rivets binders with rivet views', function () {
            describe('child view binder', function() {
                beforeEach(function () {
                    $testDom = $('<div id="' + testDom + '"></div>');
                    $body.append($testDom);
                });

                afterEach(function () {
                    if (rivetView) {
                        rivetView.remove();
                    }
                    $('#' + testDom).remove();
                });

                describe('Binders should be present for Views passed in with "childViewBinder"', function() {
                    it('if a model is passed to a binder, the model should become childView.model', function() {
                        var template = '<div id="childView"><p data-rv-new-TestView="model"></p></div>',
                            TestView = RivetView.extend({
                                defaultOptions : {
                                    template : '<ul><li data-rv-text="model:name"></li></ul>',
                                    wrapper : false
                                }
                            }),
                            options = {
                                appendTo : '#' + testDom,
                                wrapper : false,
                                template : template,
                                modelData : {
                                    name : 'Kareem Abdul Jabbar'
                                },
                                rivetsConfig : {
                                    childViewBinders : {
                                        TestView : TestView
                                    }
                                }
                            };

                        new RivetView(options).start();
                        $('#childView').html()
                            .should.equal('<p data-rv-new-testview="model">' +
                                '<ul><li data-rv-text="model:name">Kareem Abdul Jabbar</li></ul></p>');
                    });
                    it('if an object is passed to a binder, the object should become childView.options.modelData',
                        function() {
                            var template = '<div id="childView" data-rv-new-TestView="model:person"></div>',
                                TestView = RivetView.extend({
                                    defaultOptions : {
                                        template : '<ul><li data-rv-text="model:name"></li></ul>',
                                        wrapper : false
                                    }
                                }),
                                options = {
                                    appendTo : '#' + testDom,
                                    wrapper : false,
                                    template : template,
                                    modelData : {
                                        person : {
                                            name : 'Kareem Abdul Jabbar'
                                        }
                                    },
                                    rivetsConfig : {
                                        childViewBinders : {
                                            TestView : TestView
                                        }
                                    }
                                };

                            new RivetView(options).start();
                            $('#childView').html()
                                .should.equal('<ul><li data-rv-text="model:name">Kareem Abdul Jabbar</li></ul>');
                        });
                });
            });
            describe('editable binder', function() {
                beforeEach(function () {
                    $testDom = $('<div id="' + testDom + '"></div>');
                    $body.append($testDom);
                    templateWithAttribute = '<span id="testHere" data-rv-editable="model:name" contenteditable="true">' +
                        '</span>',
                    templateWithoutAttribute = '<span id="testHere" data-rv-editable="model:name"></span>',
                    options = {
                        appendTo : '#' + testDom,
                        wrapper : false,
                        template : templateWithAttribute,
                        modelData : {
                            name : 'Kareem Abdul Jabbar'
                        },
                        rivetsConfig : true
                    };
                });

                afterEach(function () {
                    if (rivetView) {
                        rivetView.remove();
                    }
                    $('#' + testDom).remove();
                });

                it('test dom is present', function () {
                    $('#' + testDom).length.should.equal(1);
                });

                it('should add the contenteditable attribute if it is not there', function (done) {
                    rivetView = new RivetView(options, {
                        template : templateWithoutAttribute
                    });
                    rivetView
                        .start()
                        .done(function() {
                            $testDom.find('#testHere').attr('contenteditable').should.equal('true');
                            done();
                        });
                });

                describe('when riveting to backbone models', function() {
                    it('should support model to view binding', function (done) {
                        rivetView = new RivetView(_.extend({}, options));
                        rivetView
                            .start()
                            .done(function() {
                                $testDom.find('#testHere').html().should.equal('Kareem Abdul Jabbar');
                                rivetView.model.set('name', 'Agua Fresca Para Mi Pero');
                                $testDom.find('#testHere').html().should.not.equal('Kareem Abdul Jabbar');
                                $testDom.find('#testHere').html().should.equal('Agua Fresca Para Mi Pero');
                                done();
                            });
                    });

                    it('should support view to model binding', function (done) {
                        rivetView = new RivetView(_.extend({}, options));
                        rivetView
                            .start()
                            .done(function() {
                                $testDom.find('#testHere').focus();
                                $testDom.find('#testHere').html('The Farmers in the Dell');

                                $testDom.find('#testHere').blur();

                                rivetView.model.get('name').should.equal('The Farmers in the Dell');
                                done();
                            });
                    });

                    it('should set the model when the user loses focus', function(done) {
                        rivetView = new RivetView(_.extend({}, options));
                        rivetView
                            .start()
                            .done(function() {
                                $testDom.find('#testHere').focus();
                                $testDom.find('#testHere').html('The Farmers in the Dell');

                                $testDom.find('#testHere').blur();

                                rivetView.model.get('name').should.equal('The Farmers in the Dell');
                                done();
                            });
                    });
                });
            });
        });
    });
