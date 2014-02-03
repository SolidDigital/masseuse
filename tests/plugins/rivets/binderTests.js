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
                    rivetView = new RivetView(_.extend({}, options, {
                        template : templateWithoutAttribute
                    }));
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
                                $testDom.find('#testHere').html('The Farmers in the Den');

                                $testDom.find('#testHere').blur();

                                rivetView.model.get('name').should.equal('The Farmers in the Den');
                                done();
                            });
                    });

                    it('should set the model when the user loses focus', function(done) {
                        rivetView = new RivetView(_.extend({}, options));
                        rivetView
                            .start()
                            .done(function() {
                                $testDom.find('#testHere').focus();
                                $testDom.find('#testHere').html('The Farmers in the Den');

                                $testDom.find('#testHere').blur();

                                rivetView.model.get('name').should.equal('The Farmers in the Den');
                                done();
                            });
                    });
                });
            });
        });
    });
