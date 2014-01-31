/*globals Event:true*/
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
            describe('contenteditable binder', function() {
                beforeEach(function () {
                    $testDom = $('<div id="' + testDom + '"></div>');
                    $body.append($testDom);
                    templateWithAttribute = '<span id="testHere" data-rv-content="model:name" contenteditable="true">' +
                        '</span>' +
                        '<div id="something"></div>',
                    templateWithoutAttribute = '',
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

                xit('should add the contenteditable attribute if it is not there', function (done) {
                    rivetView = new RivetView(_.extend({}, options));
                    rivetView
                        .start()
                        .done(function() {
                            $testDom.find('#testHere').html('The Farmers in the Den');
                            $testDom.find('#testHere').trigger('input');

                            setTimeout(function() {
                                rivetView.model.get('name').should.equal('The Farmers in the Den');
                                done();
                            }, 1000);
                        });
                });

                xit('should not add the contenteditable attribute if it is allready there', function (done) {
                    rivetView = new RivetView(_.extend({}, options));
                    rivetView
                        .start()
                        .done(function() {
                            $testDom.find('#testHere').html('The Farmers in the Den');
                            $testDom.find('#testHere').trigger('input');

                            setTimeout(function() {
                                rivetView.model.get('name').should.equal('The Farmers in the Den');
                                done();
                            }, 1000);
                        });
                });

                it('data-rv-content should make support model to view binding', function (done) {
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

                it('data-rv-content should make support view to model binding', function (done) {
                    rivetView = new RivetView(_.extend({}, options));
                    rivetView
                        .start()
                        .done(function() {
                            $testDom.find('#testHere').html('The Farmers in the Den');

                            var event = new Event('input');
                            $testDom.find('#testHere')[0].dispatchEvent(event);

                            $testDom.find('#testHere').blur();
                            rivetView.model.get('name').should.equal('The Farmers in the Den');
                            done();

                        });
                });
            });
        });
    });
