define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse) {

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
                    '<li data-rv-each-field="model:collection:" data-rv-text="field:name"></li></ul>';
                masseuseModel = masseuse.MasseuseModel.extend({
                    defaults : {}
                });
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
                ];
                options = {
                    appendTo : '#' + testDom,
                    wrapper : false,
                    template : template,
                    modelData : {
                        collection : new masseuse.Collection([], {})
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

            describe('model to view riveting', function() {
                it('should change the view when adding models', function(done) {
                    rivetView = new RivetView(options);

                    rivetView.start()
                        .done(function() {
                            $testDom.find('li').length.should.equal(0);

                            rivetView.model.get('collection').add(modelsCollection);

                            $testDom.find('li').length.should.equal(4);
                            done();
                        });
                });

                // TODO: addin in square bracket accessors to models
                xit('should change the view when updating models using square bracked notation', function() {
                    rivetView = new RivetView(options);
                    rivetView.model.get('collection').add(modelsCollection);
                    rivetView.start();
                    $testDom.find('li').eq(2).text().should.equal('Lars Ulrich');
                    rivetView.model.set('collection[2].name', 'Giovanni Martonelli');
                    rivetView.model.get('collection').at(2).get('name').should.equal('Giovanni Martonelli');
//                    $testDom.find('li').eq(2).text().should.equal('Giovanni Martonelli');
                });

                it('should change the view when removing models', function(done) {
                    rivetView = new RivetView(options);

                    rivetView.start()
                        .done(function() {
                            $testDom.find('li').length.should.equal(0);

                            rivetView.model.get('collection').add(modelsCollection);

                            $testDom.find('li').length.should.equal(4);

                            rivetView.model.get('collection').pop();

                            $testDom.find('li').length.should.equal(3);
                            done();
                        });
                });

                it('should change the view when changing models attributes', function(done) {
                    rivetView = new RivetView(options);

                    rivetView.start()
                        .done(function() {
                            rivetView.model.get('collection').add(modelsCollection);

                            $testDom.find('li').last().html().should.equal('Cliff Burton');

                            rivetView.model.get('collection').last().set('name', 'Robert Trujillo');

                            $testDom.find('li').last().html().should.equal('Robert Trujillo');
                            done();
                        });
                });
            });

        });
    });
