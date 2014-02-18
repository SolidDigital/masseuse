define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';

        var testDom = 'testDom',
            $body = $('body'),
            $testDom,
            RivetView = masseuse.plugins.rivets.RivetsView,
            rivetView,
            options,
            template;

        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('rivets components with rivet views', function () {
            beforeEach(function () {
                $testDom = $('<div id="' + testDom + '"></div>');
                $body.append($testDom);
                template = '<ul>' +
                                '<li data-rv-each-item="model:items">' +
                                    '<data-rv-list datum="item"></data-rv-list>' +
                                '</li>' +
                            '</ul>';
                options = {
                    appendTo : '#' + testDom,
                    wrapper : false,
                    template : template,
                    modelData : {
                        items : [
                            {
                                top : 1
                            },
                            {
                                top : 2
                            },
                            {
                                top : 3
                            }
                        ]
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


            it('simple component', function (done) {
                rivetView = new RivetView(_.extend({}, options, {
                    rivetsComponents : {
                        list : {
                            attributes : [],
                            build : function () {
                                return $('<p data-rv-text="datum.top"></p>')[0];
                            }
                        }
                    }
                }));
                rivetView
                    .start()
                    .done(function() {
                        $testDom.find('ul > li > p').length.should.equal(3);
                        $testDom.find('ul li:eq(1) p').html().should.equal('2');
                        done();
                    });
            });
        });
    });
