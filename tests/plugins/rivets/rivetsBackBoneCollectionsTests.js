define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'backbone', 'sinonChai', 'masseuse', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, Backbone, sinonChai, masseuse) {

        'use strict';

        var testDom = 'testDom',
            riveted = 'riveted',
            $body = $('body'),
            RivetView = masseuse.plugins.rivets.RivetsView,
            collectionTemplate,
            options,
            rivetView,
            beatles;


        chai.should();

        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('Backbone Collections', function() {
            beforeEach(function() {
                var $div = $('<div id="' + testDom + '"/>');
                $body.append($div);
            });

            afterEach(function() {
                $('#' + testDom).remove();
            });

            describe('iteration', function() {
                beforeEach(function() {
                    collectionTemplate = '<ul id="' + riveted + '">' +
                        '<li data-rv-each-beatle="collection:" data-rv-text="beatle:name"></li>' +
                        '</ul>';
                    beatles = new Backbone.Collection();

                    beatles.add([
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
                        rivetConfig : true,
                        template : collectionTemplate,
                        modelData : {
                            title : 'There it is.'
                        },
                        collection : beatles
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


                    beforeEach(function() {
                        collectionTemplate = '<ul id="' + riveted + '">' +
                            '<input data-rv-each-beatle="collection:" data-rv-value="beatle:name"/>' +
                            '</ul>';
                        beatles = new Backbone.Collection();

                        beatles.add([
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
                            rivetConfig : true,
                            template : collectionTemplate,
                            modelData : {
                                title : 'There it is.'
                            },
                            collection : beatles
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
                            var $riveted = $('#' + riveted);
                            $riveted.children().first().val().should.equal('George Harrison');
                            $riveted.children().first().val('Johnathan');
                            $riveted.children().first().trigger('input');

                            this.collection.first().get('name').should.equal('Johnathan');
                            done();
                        });
                    });
                });
            });
        });
    });
