define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'rivetsPlugin', 'masseuse',
    'backbone', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, rivetsPlugin, masseuse, Backbone) {

        'use strict';

        var testDom = 'testDom',
            riveted = 'riveted',
            $body = $('body'),
            RivetView = rivetsPlugin.view,
            Model = masseuse.MasseuseModel,
            should = chai.should(),
            rivetView,
            options,
            template;

        chai.use(sinonChai);
        mocha.setup('bdd');

        /*
         rivets.components.partial = {
            attributes: ["ref"],

            build: function() {

                var view;
                config = {stuff:this.stuff};
                view = new View(config);

                return view.el;
            }
         }
         */

        describe('rivets components with rivet views', function () {
            beforeEach(function() {
                var $div = $('<div id="' + testDom + '"><ul></ul></div>');
                $body.append($div);
            });

            afterEach(function() {
                $('#' + testDom).remove();
            });

            it('test dom is present', function() {
                $('#' + testDom).length.should.equal(1);
            });


            describe('riveting', function() {
                beforeEach(function() {
                    // TODO: redo with collections
                    template = '<li data-rv-each-item="model:list">' +
                                    '<data-rv-list></data-rv-list>' +
                                '</li>',
                    options = {
                        el : '#' + testDom,
                        template : template,
                        modelData : {
                            list : [
                                {
                                top1 : {

                                }
                                },
                                'top2',
                                {
                                    top3 : {

                                }
                                }
                            ]
                        },
                        rivetsConfig : true
                    };
                    rivetView = new RivetView(options);
                });
                afterEach(function() {
                    if (rivetView) {
                        rivetView.remove();
                    }
                });

            });
        });
    });
