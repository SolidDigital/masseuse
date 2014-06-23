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
