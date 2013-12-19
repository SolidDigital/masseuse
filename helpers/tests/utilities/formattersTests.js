define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'helpers', 'check'],
    function (_, chai, mocha, sinon, sinonChai, helpers, check) {

    'use strict';
    var formatters = helpers.formatters,
        should = chai.should();


    //-------------To make JSHINT pass-------------
    should;

    require(['sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');

    describe('Formatters', function() {

        it('prettyFileSize turns bytes into nice file sizes', function() {
            check(formatters.prettyFileSize, [
                ['0', '0 Bytes'],
                [2024, '2 KB'],
                ['2024', '2 KB'],
                [20245, '20 KB']
            ]);
        });

        it('secondsToTime turns seconds into time', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins'],
                [60 * 60 * 155 + 60 * 1 + 34, '155 hrs 1 min 34 secs'],
                ['371', '6 mins 11 secs']
            ]);
        });

        it('withComma adds a comma then a space', function() {
            check(formatters.withComma, [
                ['george', 'george, '],
                [123, '123, ']
            ]);
        });

        it('joinWithComma joins an array with commas then spaces', function() {
            check(formatters.joinWithComma, [
                [[1,2,3,4,5,6,7], '1, 2, 3, 4, 5, 6, 7'],
                [['hello', 'world', 'people', 5], 'hello, world, people, 5']
            ]);
        });

        it('withForwardSlash adds a space then a backslash then a space', function() {
            check(formatters.withForwardSlash, [
                [120, '120 / '],
                ['string', 'string / ']
            ]);
        });

        it('withColon adds a space then a colon then a space', function() {
            check(formatters.withColon, [
                [120, '120 : '],
                ['string', 'string : ']
            ]);
        });

        it('spaceAfter adds a space after', function() {
            check(formatters.spaceAfter, [
                [120, '120 '],
                ['string', 'string ']
            ]);
        });

        it('spaceBefore adds a space before the value', function() {
            check(formatters.spaceBefore, [
                [120, ' 120'],
                ['string', ' string']
            ]);
        });

        it('prettyDate makes a iso date string nicer looking', function() {
            check(formatters.prettyDate, [
                [120, '12/31/1969 4:00:00 PM']
            ]);
        });

        it('dollars formats a number as American Dollars', function() {
            check(formatters.dollars, [
                [120, '$1.20'],
                [17398, '$173.98'],
                [0, '$0.00']
            ]);
        });

        it('equals checks two values to see if they are double equal, returns a boolean', function() {
            check(formatters.equals, [
                [120, 120, true],
                ['admin', 'admin', true],
                [540, 230, false],
                ['george', 'larry', false],
                ['120', 120, true],
                [{key: 'value', dude: [1,2,3]}, {key: 'value', dude: [1,2,3]}, false]
            ]);
        });

        it('existsOr checks if the first arg exists, if true returns it, if false returns the second arg', function() {
            check(formatters.existsOr, [
                [120, 230, 120],
                ['', 'Yeah', 'Yeah'],
                ['Juju', 'balling', 'Juju']
            ]);
        });

        it('limit will splice an array based on the second argument passed', function() {
            check(formatters.limit, [
                [[1,2,3], 2, [1,2]]
            ]);
        });

        it('humanize capitalizes the first letter in a word', function() {
            check(formatters.humanize.read, [
                ['world', 'World'],
                ['ending', 'Ending'],
                ['bomb', 'Bomb']
            ]);
            check(formatters.humanize.publish, [
                ['World', 'world'],
                ['Ending', 'ending'],
                ['Bomb', 'bomb']
            ]);
        });

        it('jsonAsString turns a JSON object into a string', function() {
            check(formatters.jsonAsString, [
                [{ key: 'value', dude: [1,2,3]}, '{"key":"value","dude":[1,2,3]}']
            ]);
        });

        it('booleantoenabled turns a boolean into the strings enabled or disabled', function() {
            check(formatters.booleantoenabled, [
                [true, 'enabled'],
                [false, 'disabled']
            ]);
        });

        it('pluralize adds an s to the second argument passed, if the first argument is greater than 1', function() {
            check(formatters.pluralize, [
                [1, 'whale', '1 whale'],
                [4, 'car', '4 cars'],
                [0, 'gnat', '0 gnats']
            ]);
        });

        it('includes ensures that the first value passed is one of the other arguments, returns boolean', function() {
            check(formatters.includes, [
                ['admin', 'admin', 'reader', true],
                ['admin', 'reader', 'admin', true],
                ['reader', 'reader', 'admin', true],
                ['editor', 'admin', 'reader', false]
            ]);
        });
    });
});