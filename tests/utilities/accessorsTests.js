define(['underscore', 'backbone', 'chai', 'mocha', 'sinon', 'sinonChai', '../../app/utilities/accessors', 'sinonSpy'],
    function (_, Backbone, chai, mocha, sinon, sinonChai, accessors) {

        'use strict';

        chai.should();

        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('accessors', function () {
            describe('get', function() {
                describe('for objects', function() {
                    it('should access nested object', function () {
                        accessors.getProperty(nestedObject(), 'one.two.three').should.equal('okay');
                    });
                });
                describe('for arrays', function() {
                    describe('should access array items by index', function() {
                        it('raw array', function() {
                            accessors.getProperty(simpleArray(), '[2]').should.equal('two');
                        });
                        it('nested array', function() {
                            accessors.getProperty(nestedArray(), '[2][1]').should.equal('and one');
                        });
                        it('array in object', function() {
                            accessors.getProperty(arrayInObject(), 'a[1]').should.equal('go');
                        });
                    });
                    // TODO: creates nested arrays as goes down, if create
                });
                describe('for Collections', function() {
                    it('should access model by index', function() {
                        accessors.getProperty(simpleCollection(), '[1].value').should.equal('Gertrude');
                    });
                });
            });
            describe('set', function() {
                describe('for arrays', function() {
                    it('raw array', function() {
                        accessors
                            .setProperty([0,2,2], '[1]', 1)
                            .should.deep.equal([0,1,2]);
                    });
                });
                describe('for Collections', function() {
                    it('should update model by index', function() {
                        var collection = simpleCollection();
                        accessors.setProperty(collection, '[1]', {value:'Felix'});
                        collection.at(1).get('value').should.equal('Felix');
                    });
                    it('should update value on model by index', function() {
                        var collection = simpleCollection();
                        accessors.setProperty(collection, '[1].value', 'Bomfour');
                        collection.at(1).get('value').should.equal('Bomfour');
                    });
                    it('should add models to the collection as needed', function() {
                        var collection = simpleCollection();
                        accessors.setProperty(collection, '[3]', {value:'Felix'});
                        collection.at(0).get('value').should.equal('Johan');
                        collection.at(1).get('value').should.equal('Gertrude');
                        collection.at(2).get('value').should.equal('JoJo');
                        collection.at(3).get('value').should.equal('Felix');
                    });
                });
            });
        });

        function arrayInObject() {
            return {
                a : [
                    'no', 'go'
                ]
            };
        }

        function nestedArray() {
            return [
                [],
                [],
                [
                    'and zero','and one','and two'
                ],
                []
            ];
        }

        function nestedObject() {
            return {
                one : {
                    two : {
                        three : 'okay'
                    }
                }
            };
        }

        function simpleArray() {
            return [
                'zero', 'one', 'two', 'three'
            ];
        }

        function simpleCollection() {
            return new Backbone.Collection([
                {value : 'Johan'},
                {value : 'Gertrude'},
                {value : 'JoJo'}
            ]);
        }
    });
