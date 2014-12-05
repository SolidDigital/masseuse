define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';

        var testDom = 'testDom',
            $body = $('body'),
            $testDom,
            RivetView = masseuse.plugins.rivets.RivetsView,
            rivetView;

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
                    describe('passing data in', function() {
                        var TestView,
                            options;

                        beforeEach(function() {
                            TestView = RivetView.extend({
                                defaultOptions : {
                                    template : '<ul><li data-rv-text="model:name"></li></ul>'
                                }
                            });
                            options = {
                                appendTo : '#' + testDom,
                                wrapper : false,
                                rivetsConfig : {
                                    childViewBinders : {
                                        TestView : TestView
                                    }
                                }
                            };
                        });
                        it('if a model is passed to a binder, the model should become childView.model', function() {
                            var template = '<div id="childView"><p data-rv-new-TestView="model"></p></div>';

                            options = _.extend(options, {
                                template : template,
                                modelData : {
                                    name : 'Kareem Abdul Jabbar'
                                }
                            });

                            new RivetView(options).start();
                            $('#childView').html()
                                .should.equal('<p data-rv-new-testview="model">' +
                                '<ul><li data-rv-text="model:name">Kareem Abdul Jabbar</li></ul></p>');
                        });
                        it('if a collection is passed to a binder, the collection should become childView.collection',
                            function() {
                                var template = '<div id="childView" data-rv-new-CollectionView="model:someCollection">'+
                                        '</div>',
                                    CollectionView = TestView.extend({
                                        defaultOptions : {
                                            template : '<ul><li data-rv-each-person="collection:" ' +
                                                'data-rv-text="person:name"></li></ul>'
                                        }
                                    });

                                options = _.extend(options, {
                                    template : template,
                                    modelData : {
                                        someCollection : new masseuse.Collection([
                                            {
                                                name : 'Kareem Abdul Jabbar'
                                            },
                                            {
                                                name : 'Ada Lovelace'
                                            }
                                        ])
                                    },
                                    rivetsConfig : {
                                        childViewBinders : {
                                            CollectionView : CollectionView
                                        }
                                    }
                                });

                                new RivetView(options).start();
                                $('#childView').text()
                                    .should.equal('Kareem Abdul JabbarAda Lovelace');
                            });
                        it('if an object is passed to a binder, the object should become childView.options.modelData',
                            function() {
                                var template = '<div id="childView" data-rv-new-TestView="model:person"></div>';
                                options = _.extend(options, {
                                    template : template,
                                    modelData : {
                                        person : {
                                            name : 'Kareem Abdul Jabbar'
                                        }
                                    }
                                });

                                new RivetView(options).start();
                                $('#childView').html()
                                    .should.equal('<ul><li data-rv-text="model:name">Kareem Abdul Jabbar</li></ul>');
                            });
                    });
                    it('child view template can include a text node that is riveted', function() {
                        var template = '<div id="childView"><p data-rv-new-TestView="model"></p></div>',
                            TestView = RivetView.extend({
                                defaultOptions : {
                                    template : '{{ model:name }}'
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
                            .should.equal('<p data-rv-new-testview="model">Kareem Abdul Jabbar</p>');
                    });
                    it('child view template can include text nodes that are riveted', function() {
                        var template = '<div id="childView"><p data-rv-new-TestView="model"></p></div>',
                            TestView = RivetView.extend({
                                defaultOptions : {
                                    template : '{{ model:name }}<p>Something</p>{{ model:name }}'
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
                            .should.equal('<p data-rv-new-testview="model">Kareem Abdul Jabbar<p>Something</p>' +
                            'Kareem Abdul Jabbar</p>');
                    });
                    describe('use of a factory', function() {
                        var parentView,
                            $childView,
                            ViewA,
                            ViewB,
                            options;

                        beforeEach(function() {
                            ViewA = RivetView.extend({
                                defaultOptions : {
                                    template : '<div>a</div>'
                                }
                            });
                            ViewB = RivetView.extend({
                                defaultOptions : {
                                    template :'<div>b</div>',
                                    wrapper : false
                                }
                            });
                            options = {
                                appendTo : '#' + testDom,
                                wrapper : false,
                                template :
                                '<ul id="childView">' +
                                '<li data-rv-each-view="model:views" data-rv-new-ab-factory="view"></li>' +
                                '</ul>',
                                modelData : {
                                    views : [
                                        {type : 'a'},{type: 'b'}
                                    ]
                                },
                                rivetsConfig : {
                                    childViewBinders : {
                                        'ab-factory' : function(options) {
                                            switch (options.modelData.type) {
                                            case 'a':
                                                return new ViewA(options);
                                            case 'b':
                                                return new ViewB(options);
                                            default:
                                                return undefined;
                                            }
                                        }
                                    }
                                }
                            };
                        });
                        it('the factory should be called once per child view binder', function() {
                            var factorySpy = sinon.spy(options.rivetsConfig.childViewBinders, 'ab-factory');
                            factorySpy.should.not.have.been.called;
                            parentView = new RivetView(options);
                            parentView.start();
                            factorySpy.should.have.been.calledTwice;
                        });
                        it('is possible as a childViewBinder value', function() {
                            parentView = new RivetView(options);
                            parentView.start();
                            $childView = $('#childView');
                            $childView.find('li:eq(0)').text().should.equal('a');
                            $childView.find('li:eq(1)').text().should.equal('b');
                            (parentView.children[0] instanceof ViewA).should.be.true;
                            (parentView.children[1] instanceof ViewB).should.be.true;
                        });

                    });
                });
            });
        });
    });
