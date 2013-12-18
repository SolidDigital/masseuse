define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'helpers', 'check'],
    function (_, chai, mocha, sinon, sinonChai, helpers, check) {

    'use strict';

    var validation = helpers.validation,
        should = chai.should();

    require(['sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');


    describe('validation', function () {

        describe('stringHasLength Method', function () {

            it('should exist', function () {
                should.exist(validation.stringHasLength);
            });

            it('should return false on an empty string', function () {
                validation.stringHasLength('').should.be.false;
            });

            it('should return true on a string with a length', function () {
                validation.stringHasLength('stringhaslength').should.be.true;
            });

            it('should fail if passed a non-string', function () {
                var something = [];
                validation.stringHasLength(something).should.be.false;
            });

        });

        describe('isEmail method', function () {
            it('formats properly', function() {
                check(validation.isEmail, [
                    ['test@somewhere.com', true],//, 'should return false if @ symbol is missing'],
                    ['test@somewhere.com', true],//, 'should return true if format is string@string.com'],
                    ['test@test.net', true],//, 'should also allow alternative . endings'],
                    ['test@test.test.test', true],
                    ['@test.com', false],//, 'should return false if you are missing anything before @'],
                    ['this is not an email', false]//, 'should be false for plain string']
                ]);
            });
        });

        describe('minLength method', function () {

            it('should return false if the string does not have the minimum length', function () {
                validation.minLength('test', 6).should.be.false;
            });

            it('should return true if the string has at least the minimum length', function () {
                validation.minLength('test', 3).should.be.true;
            });

            it('should return true if the string is exactly the minimum length', function () {
                validation.minLength('test', 4).should.be.true;
            });

        });

        describe('maxLength method', function () {

            it('should return false if the string is longer than maximum length', function () {
                validation.maxLength('testing', 3).should.be.false;
            });

            it('should return true if the string is not longer than the maximum length', function () {
                validation.maxLength('testing', 20).should.be.true;
            });

            it('should return true if the string is exactly the maximum length', function () {
                validation.maxLength('test', 4).should.be.true;

            });

        });

        describe('isCurrency method', function () {
            it('formats properly', function() {
                check(validation.isCurrency, [
                    ['$2.78', true],//, 'in a proper currency format'],
                    ['$2.78123312312', true],//, 'in a proper currency format with high sig figs'],
                    ['$2.78.98.9',false],//, 'with multiple decimals'],
                    [4.67, false],//, 'other than a string'],
                    ['2.78',false]//, 'without $ symbol']
                ]);
            });
        });

        describe('isNumeric method', function () {
            it('should return false if passed a string containing an alpha character', function () {
                validation.isNumeric('hello897').should.be.false;
            });

            it('should return true if passed a string containing only numeric characters', function () {
                validation.isNumeric('897').should.be.true;
            });
        });

        describe('isAlpha method', function () {
            it('should return false if passed a string containing numbers', function () {
                validation.isAlpha('278test').should.be.false;
            });

            it('should return true if passed a string containing only letters', function () {
                validation.isAlpha('test').should.be.true;
            });

            it('should return false if passed a number', function () {
                validation.isAlpha(278).should.be.false;
            });

            it('should return false if passed a string containing letters and special chars', function () {
                validation.isAlpha('@test?').should.be.false;
            });
        });

        describe('isAlphaNumeric method', function () {
            it('should return true if passed a string containing only numbers', function () {
                validation.isAlphaNumeric('278').should.be.true;
            });

            it('should return true if passed a string containing letters and numbers', function () {
                validation.isAlphaNumeric('test123').should.be.true;
            });

            it('should return true if passed a number', function () {
                validation.isAlphaNumeric(278).should.be.true;
            });

            it('should return true if passed a string with only letters', function () {
                validation.isAlphaNumeric('test').should.be.true;
            });

            it('should return false if passed a string containing letters and special chars and numbers', function () {
                validation.isAlphaNumeric('@test123?').should.be.false;
            });
        });

    });
});