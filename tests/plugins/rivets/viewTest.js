define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'rivetsPlugin', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, rivetsPlugin) {

        'use strict';

        var testDom = 'testDom',
            riveted = 'riveted',
            $body = $('body'),
            template = '<div id="' + riveted + '">{{data.title}}</div>',
            RivetView = rivetsPlugin.view;

        chai.use(sinonChai);
        mocha.setup('bdd');


        describe('view riveting', function () {
            beforeEach(function() {
                var $div = $('<div id="' + testDom + '"/>');
                $body.append($div);
            });

            afterEach(function() {
                $('#' + testDom).remove();
            });

            it('test dom is present', function() {
                $('#' + testDom).length.should.equal(1);
            });

            it('test dom is riveted', function(done) {
                var options = {
                    el : '#' + testDom,
                    templateHtml : template,
                    modelData : {
                        title : 'There it is.'
                    }
                };

                new RivetView(options).start().done(function() {
                    $('#' + riveted).html().should.equal('There it is.');
                    done();
                });
            });
        });
    });
