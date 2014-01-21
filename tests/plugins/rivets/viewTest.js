define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'rivetsPlugin',
    'masseuse', 'backbone', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, rivetsPlugin,
              masseuse, Backbone) {

        'use strict';

        var testDom = 'testDom',
            riveted = 'riveted',
            $body = $('body'),
            RivetView = rivetsPlugin.view,
            Model = masseuse.MasseuseModel;

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


            describe('riveting', function() {
                var rivetView;
                afterEach(function() {
                    if (rivetView) {
                        rivetView.remove();
                    }
                });

                describe('Backbone Models', function() {
                    describe('templating', function() {
                        var options,
                            template = '<div id="' + riveted + '">{{model:title}}</div>';

                        beforeEach(function() {
                            options = {
                                el : '#' + testDom,
                                template : template,
                                modelData : {
                                    title : 'There it is.'
                                }
                            };
                            rivetView = new RivetView(options);
                        });
                        it('test dom is riveted with initial data', function(done) {
                            rivetView.start().done(function() {
                                $('#' + riveted).html().should.equal('There it is.');
                                done();
                            });
                        });

                        it('test dom is riveted when data changes', function(done) {
                            rivetView.start().done(function() {
                                rivetView.model.set('title', 'New Title');
                                $('#' + riveted).html().should.equal('New Title');
                                done();
                            });
                        });
                        describe('nested fields', function() {
                            beforeEach(function() {
                                options = {
                                    el : '#' + testDom,
                                    template : '<div id="' + riveted + '">{{model:movie->title}}</div>',
                                    modelData : {
                                        movie : {
                                            title : 'A the an.'
                                        }
                                    }
                                };
                                rivetView = new RivetView(options);
                            });
                            it('test dom is riveted with nested data in a model', function(done) {
                                rivetView.start().done(function() {
                                    $('#' + riveted).html().should.equal('A the an.');
                                    done();
                                });
                            });
                            describe('nested models', function() {
                                var nested;
                                beforeEach(function() {
                                    nested = new Model({title:'test'});
                                    options = {
                                        el : '#' + testDom,
                                        template : '<div id="' + riveted + '">{{model:nested->title}}</div>',
                                        modelData : {
                                            nested : nested
                                        }
                                    };
                                    rivetView = new RivetView(options);
                                });
                                it('test dom is riveted with nested model in a model', function(done) {
                                    rivetView.start().done(function() {
                                        $('#' + riveted).html().should.equal('test');
                                        done();
                                    });
                                });
                                it('test dom changes when nested model changes', function(done) {
                                    rivetView.start().done(function() {
                                        nested.set('title', 'other');
                                        $('#' + riveted).html().should.equal('other');
                                        done();
                                    });
                                });
                            });
                            describe('deeply nested model', function() {
                                var nested,
                                    deepNested;
                                beforeEach(function() {
                                    nested = new Model({title:'test'});
                                    deepNested = new Model({oh:{yeah:'boom'}});
                                    nested.set({this:{that:{other: deepNested}}});
                                    options = {
                                        el : '#' + testDom,
                                        template : '<div id="' + riveted +
                                            '">{{model:nested->this->that->other->oh->yeah}}</div>',
                                        modelData : {
                                            nested : nested
                                        }
                                    };
                                    rivetView = new RivetView(options);
                                });
                                it('test dom is riveted when deeply nested model changes', function(done) {
                                    rivetView.start().done(function() {
                                        $('#' + riveted).html().should.equal('boom');
                                        done();
                                    });
                                });
                                it('test dom changes when top level model sets nested model', function(done) {
                                    rivetView.start().done(function() {
                                        rivetView.model.set('nested.this.that.other.oh.yeah', 'changed');
                                        $('#' + riveted).html().should.equal('changed');
                                        done();
                                    });
                                });
                                it('test dom changes when deep model sets nested model', function(done) {
                                    rivetView.start().done(function() {
                                        deepNested.set('oh.yeah', 'la la la');
                                        $('#' + riveted).html().should.equal('la la la');
                                        done();
                                    });
                                });
                            });
                        });
                    });

                    describe('attribute binding', function() {
                        describe('primitives', function() {
                            var attributeOptions;

                            beforeEach(function() {
                                attributeOptions = {
                                    el : '#' + testDom,
                                    template : '<div id="' + riveted + '" data-rv-href="model:href">test</div>',
                                    modelData : {
                                        href : 'http://www.blah.com'
                                    }
                                };
                                rivetView = new RivetView(attributeOptions);
                            });
                            it('test dom is riveted with initial data', function(done) {
                                rivetView.start().done(function() {
                                    $('#' + riveted).attr('href').should.equal('http://www.blah.com');
                                    done();
                                });
                            });
                            it('test dom is riveted when attribute binder changes', function(done) {
                                rivetView.start().done(function() {
                                    rivetView.model.set('href', 'http://www.yada.org');
                                    $('#' + riveted).attr('href').should.equal('http://www.yada.org');
                                    done();
                                });
                            });
                        });

                        describe('arrays', function() {
                            var attributeOptions;

                            beforeEach(function() {
                                attributeOptions = {
                                    el : '#' + testDom,
                                    template : '<div data-rv-each-ref="model:href" id="' + riveted +
                                        '" >{{ref}}</div>',
                                    modelData : {
                                        href : ['http://www.blah.com']
                                    }
                                };
                                rivetView = new RivetView(attributeOptions);
                            });
                            it('test dom is riveted with initial data', function(done) {
                                rivetView.start().done(function() {
                                    $('#' + riveted).html().should.equal('http://www.blah.com');
                                    done();
                                });
                            });
                            it('test dom is riveted when attribute binder changes', function(done) {
                                rivetView.start().done(function() {
                                    rivetView.model.set('href', ['http://www.yada.org']);
                                    $('#' + riveted).html().should.equal('http://www.yada.org');
                                    done();
                                });
                            });
                        });
                    });

                    describe('iteration', function() {
                        describe('array', function() {
                            var options,
                                rivetView,
                                iterationTemplate = '<ul id="' + riveted + '">' +
                                    '<li data-rv-each-item="model:items"></li></ul>';


                            beforeEach(function() {
                                options = {
                                    el : '#' + testDom,
                                    template : iterationTemplate,
                                    modelData : {
                                        items : [
                                            'Mike',
                                            'Peter',
                                            'Nate',
                                            'John',
                                            'Alex',
                                            'Greg',
                                            'Adam',
                                            'Travis',
                                            'Cooper'
                                        ]
                                    }
                                };
                                rivetView = new RivetView(options);
                            });
                            it('should iterate over a array when initialized', function(done) {
                                rivetView.start().done(function() {
                                    $('#' + riveted).children().length.should.equal(9);
                                    done();
                                });
                            });

                            it('should re-rivet the iterated items when changed', function(done) {
                                rivetView.start().done(function() {
                                    rivetView.model.set('items', [
                                        'Mike'
                                    ]);

                                    $('#' + riveted).children().length.should.equal(1);
                                    done();
                                });
                            });
                        });

                        describe('array of objects', function() {
                            var options,
                                rivetView,
                                iterationTemplate = '<ul id="' + riveted + '">' +
                                    '<li data-rv-each-item="model:items" ' +
                                    'data-rv-id="item.id" ' +
                                    'data-rv-text="item.text" ' +
                                    'data-rv-href="item.href"></li>' +
                                    '</ul>';


                            beforeEach(function() {
                                options = {
                                    el : '#' + testDom,
                                    template : iterationTemplate,
                                    modelData : {
                                        items : [
                                            {
                                                id: 'lozeng',
                                                text: 'Jibba Jabba',
                                                href: 'www.google.com'
                                            },
                                            {
                                                id: 'DarkTimes',
                                                text: 'Skippy Peanut Butter',
                                                href: 'www.ghengisKahn.com'
                                            }
                                        ]
                                    }
                                };
                                rivetView = new RivetView(options);
                            });
                            it('should iterate over a array of objects when initialized', function(done) {
                                rivetView.start().done(function() {
                                    var $riveted = $('#' + riveted);
                                    $riveted.children().length.should.equal(2);

                                    $riveted.children().eq(0).attr('id').should.equal('lozeng');
                                    $riveted.children().eq(1).attr('id').should.equal('DarkTimes');

                                    $riveted.children().eq(0).attr('href').should.equal('www.google.com');
                                    $riveted.children().eq(1).attr('href').should.equal('www.ghengisKahn.com');

                                    done();
                                });
                            });

                            it('should re-rivet the iterated array of objects when changed', function(done) {
                                rivetView.start().done(function() {
                                    rivetView.model.set('items', [
                                        {
                                            id: 'lozeng',
                                            text: 'Jibba Jabba',
                                            href: 'www.zipzapzoop.com'
                                        },
                                        {
                                            id: 'DarkTimes',
                                            text: 'Skippy Peanut Butter',
                                            href: 'www.fellowsMonitorStands.com'
                                        }
                                    ]);

                                    var $riveted = $('#' + riveted);

                                    $riveted.children().eq(0).attr('href').should.equal('www.zipzapzoop.com');
                                    $riveted.children().eq(1).attr('href').should.equal('www.fellowsMonitorStands.com');

                                    done();
                                });
                            });
                        });
                    });
                });


                describe('Backbone Collections', function() {
                    describe('iteration', function() {
                        var collectionTemplate = '<ul id="' + riveted + '">' +
                                '<li data-rv-each-beatle="collection:" data-rv-text="beatle:name"></li>' +
                                '</ul>',
                            options,
                            rivetView;

                        beforeEach(function() {
                            var Beatles = new Backbone.Collection();

                            Beatles.add([
                                {
                                    name: 'George Harrison',
                                    instrument: [
                                        'Guitar',
                                        'vox'
                                    ]
                                },
                                {
                                    name: 'Ringo Star',
                                    instrument: 'drums'
                                },
                                {
                                    name: 'John Lennon',
                                    instrument: [
                                        'guitar',
                                        'vox'
                                    ]
                                },
                                {
                                    name: 'Paul McCartney',
                                    instrument: [
                                        'bass',
                                        'piano',
                                        'vox'
                                    ]
                                }
                            ]);

                            options = {
                                el : '#' + testDom,
                                template : collectionTemplate,
                                modelData : {
                                    title : 'There it is.'
                                },
                                collection : Beatles
                            };

                            rivetView = new RivetView(options);
                        });


                        it('should iterate through the models attribute on the collection when passed', function(done) {
                            rivetView.start().done(function() {
                                $('#' + riveted).children().length.should.equal(4);
                                done();
                            });
                        });

                        it('should pass through the models scope during iteration', function(done) {
                            rivetView.start().done(function() {
                                $('#' + riveted).children().first().text().should.equal('George Harrison');
                                done();
                            });
                        });

                        describe('binding', function() {
                            var collectionTemplate = '<ul id="' + riveted + '">' +
                                    '<input data-rv-each-beatle="collection:" data-rv-value="beatle:name"/>' +
                                    '</ul>',
                                options,
                                rivetView;

                            beforeEach(function() {
                                var Beatles = new Backbone.Collection();

                                Beatles.add([
                                    {
                                        name: 'George Harrison',
                                        instrument: [
                                            'Guitar',
                                            'vox'
                                        ]
                                    },
                                    {
                                        name: 'Ringo Star',
                                        instrument: 'drums'
                                    },
                                    {
                                        name: 'John Lennon',
                                        instrument: [
                                            'guitar',
                                            'vox'
                                        ]
                                    },
                                    {
                                        name: 'Paul McCartney',
                                        instrument: [
                                            'bass',
                                            'piano',
                                            'vox'
                                        ]
                                    }
                                ]);

                                options = {
                                    el : '#' + testDom,
                                    template : collectionTemplate,
                                    modelData : {
                                        title : 'There it is.'
                                    },
                                    collection : Beatles
                                };

                                rivetView = new RivetView(options);
                            });
                            it('should add more elements to the dom when more models are added', function(done) {
                                rivetView.start().done(function() {
                                    $('#' + riveted).children().length.should.equal(4);
                                    this.collection.add({
                                        name: 'Peter',
                                        instrument: 'Penny Whistle'
                                    });
                                    $('#' + riveted).children().length.should.equal(5);
                                    done();
                                });
                            });

                            it('should remove elements from the dom when more models are removed', function(done) {
                                rivetView.start().done(function() {
                                    $('#' + riveted).children().length.should.equal(4);
                                    this.collection.pop();
                                    $('#' + riveted).children().length.should.equal(3);
                                    done();
                                });
                            });

                            it('dom should respond to data changes in the collections models', function(done) {
                                rivetView.start().done(function() {
                                    $('#' + riveted).children().first().val().should.equal('George Harrison');
                                    this.collection.first().set('name', 'Johnathan');
                                    $('#' + riveted).children().first().val().should.equal('Johnathan');
                                    done();
                                });
                            });

                            it('models should respond to changes in the dom', function(done) {
                                rivetView.start().done(function() {
                                    $('#' + riveted).children().first().val().should.equal('George Harrison');
                                    $('#' + riveted).children().first().attr('value', 'Johnathan');
                                    this.collection.first().get('name').should.equal('Johnathan');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
