define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'backbone', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse, Backbone) {

        'use strict';

        var testDom = 'testDom',
            $body = $('body'),
            $testDom,
            RivetView = masseuse.plugins.rivets.RivetsView,
            rivetView,
            options,
            template,
            masseuseModel,
            modelsCollection;

        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('iteration over backbone collection with masseuse model', function () {

            beforeEach(function () {
                $testDom = $('<div id="' + testDom + '"></div>');
                $body.append($testDom);
                template = '<ul id="testHere">' +
                    '<li data-rv-each-field="collection:" data-rv-text="field:name"></li></ul>',
                masseuseModel = masseuse.MasseuseModel.extend({
                    defaults : {}
                }),
                modelsCollection = [
                    {
                        name: 'James Hetfield'
                    },
                    {
                        name: 'Kirk Hammett'
                    },
                    {
                        name: 'Lars Ulrich'
                    },
                    {
                        name: 'Cliff Burton'
                    }
                ],
                options = {
                    appendTo : '#' + testDom,
                    wrapper : false,
                    template : template,
                    modelData : {},
                    rivetsConfig : true,
                    collection : new (Backbone.Collection.extend({
                        model : masseuseModel
                    }))([], {})
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

            describe('model to view riveting', function() {
                it('should change the view when adding models', function(done) {
                    rivetView = new RivetView(options);

                    rivetView.start()
                        .done(function() {
                            $testDom.find('li').length.should.equal(0);

                            rivetView.collection.add(modelsCollection);

                            $testDom.find('li').length.should.equal(4);
                            done();
                        });
                });

                it('should change the view when removing models', function(done) {
                    rivetView = new RivetView(options);

                    rivetView.start()
                        .done(function() {
                            $testDom.find('li').length.should.equal(0);

                            rivetView.collection.add(modelsCollection);

                            $testDom.find('li').length.should.equal(4);

                            rivetView.collection.pop();

                            $testDom.find('li').length.should.equal(3);
                            done();
                        });
                });

                it('should change the view when changing models attributes', function(done) {
                    rivetView = new RivetView(options);

                    rivetView.start()
                        .done(function() {
                            rivetView.collection.add(modelsCollection);

                            $testDom.find('li').last().html().should.equal('Cliff Burton');

                            rivetView.collection.last().set('name', 'Robert Trujillo');

                            $testDom.find('li').last().html().should.equal('Robert Trujillo');
                            done();
                        });
                });
            });

        });
    });
