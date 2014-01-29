define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, masseuse) {
        'use strict';

        chai.should();

        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('ViewContext', function () {

            var ViewContext;
            beforeEach(function () {
                ViewContext = masseuse.ViewContext;
            });

            it('binds correctly in simple case', function () {
                var config = {
                        name : new ViewContext('name')
                    },
                    person = {
                        name : 'bob'
                    };

                config.name.getBoundFunction(person).should.equal('bob');
            });

            it('binds correctly with nested fields', function () {
                var config = {
                        last : new ViewContext('name.last')
                    },
                    person = {
                        name : {
                            first : 'bob',
                            last : 'bobertson'
                        }
                    };

                config.last.getBoundFunction(person).should.equal('bobertson');
            });
        });
    });
