define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'check'],
    function (_, chai, mocha, sinon, sinonChai, masseuse, check) {

    'use strict';
    var formatters = masseuse.formatters,
        should = chai.should();


    require(['sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');

    describe('Formatters', function() {

        it('prettyFileSize', function() {
            check(formatters.prettyFileSize, [
                ['0', '0 Bytes'],
                [2024, '2 KB'],
                ['2024', '2 KB'],
                [20245, '20 KB']
            ]);
        });

        it('secondsToTime', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins'],
                [60 * 60 * 155 + 60 * 1 + 34, '155 hrs 1 min 34 secs'],
                ['371', '6 mins 11 secs']
            ]);
        });

        it('withComma', function() {
            check(formatters.withComma, [
                ['george', 'george, '],
                [123, '123, ']
            ]);
        });

        it('joinWithComma', function() {
            check(formatters.joinWithComma, [
                [[1,2,3,4,5,6,7], '1,2,3,4,5,6,7'],
                [['hello', 'world', 'people', 5], 'hello,world,people,5']
            ]);
        });

        it('withBackslash', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('withColon', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('spaceAfter', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('spaceBefore', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('prettyDate', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('dollars', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('equals', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('exists', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('limit', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('humanize', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('jsonAsString', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('pluralize', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });

        it('includes', function() {
            check(formatters.secondsToTime, [
                [120, '2 mins']
            ]);
        });
    });
});