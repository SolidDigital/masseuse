define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'check', '../../../app/plugins/rivets/formatters',
    'masseuse', 'jquery', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, check, formatters, masseuse, $) {

        'use strict';
        var should = chai.should(),
            $body = $('body'),
            RivetView = masseuse.plugins.rivets.RivetsView;

        should;

        require(['sinonCall', 'sinonSpy']);
        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('Formatters', function() {
            beforeEach(function() {
                var $div = $('<div id="testDom"/>');
                $body.append($div);
            });

            afterEach(function() {
                $('#testDom').remove();
            });

            it('test dom is present', function() {
                $('#testDom').length.should.equal(1);
            });

            it('should work in an actual view', function(done) {
                var template = '<div id="riveted" data-rv-text="model:title | withColon"></div>',
                    rivetView,
                    options = {
                        el : '#testDom',
                        template : template,
                        rivetConfig : true,
                        modelData : {
                            title : 'Inferno'
                        }
                    };

                rivetView = new RivetView(options);

                rivetView.start().done(function() {
                    $('#riveted').html().should.equal('Inferno : ');
                    done();
                    rivetView.remove();
                });
            });

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

            it('_ proxies underscore methods', function() {
                check(formatters._, [
                    [[1,2,3], 'size', 3],
                    [{a:1,b:2,c:3}, 'size', 3],
                    [[1,0], 'every', false],
                    [[1,0], 'some', true]
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
                // phantom JS has issues parsing dates : https://github.com/ariya/phantomjs/issues/11151
                // mocking out date object to handle time zone diffs.
                var expected = '12/21/2014 7:29:36 AM',
                    oldToLocaleDateString = window.Date.prototype.toLocaleDateString,
                    oldToLocaleTimeString = window.Date.prototype.toLocaleTimeString;

                window.Date.prototype.toLocaleDateString = function() {
                    return '12/21/2014';
                };

                window.Date.prototype.toLocaleTimeString = function() {
                    return '7:29:36 AM';
                };

                check(formatters.prettyDate, [
                    ['2014-12-21T15:29:36.228Z', expected]
                ]);


                window.Date.prototype.toLocaleDateString = oldToLocaleDateString;
                window.Date.prototype.toLocaleTimeString = oldToLocaleTimeString;
            });

            it('prettyDateNoTime returns a formatted date without the time', function() {
                check(formatters.prettyDateNoTime, [
                    ['2014-12-21T15:29:36.228Z', '12/21/2014']
                ]);
            });

            it('centsToDollars formats a number represented as cents to American Dollars', function() {
                check(formatters.centsToDollars, [
                    [120, '$1.20'],
                    [17398, '$173.98'],
                    [0, '$0.00'],
                    [59, '$0.59'],
                    [1, '$0.01'],
                    [120.567, '$1.21'],
                    [0.5, '$0.01'],
                    [0.1, '$0.00']
                ]);
            });

            it('asDollars formats a number represented as dollars to American Dollars', function() {
                check(formatters.asDollars, [
                    [120, '$120.00'],
                    [17398, '$17398.00'],
                    [0, '$0.00'],
                    [59, '$59.00'],
                    [1, '$1.00'],
                    [120.567, '$120.57'],
                    [0.5, '$0.50'],
                    [0.1, '$0.10']
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

            it('existsOr checks if the first arg exists, if true returns it, if false returns second arg', function() {
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
                    [{ key: 'value', dude: [1,2,3]},
                        '{\n    "key": "value",\n    "dude": [\n        1,\n        2,\n        3\n    ]\n}']
                ]);
            });

            it('booleantoenabled turns a boolean into the strings enabled or disabled', function() {
                check(formatters.booleantoenabled, [
                    [true, 'Enabled'],
                    [false, 'Disabled']
                ]);
            });

            it('pluralize adds an s to the second argument passed, if the first argument is greater than 1', function() {
                check(formatters.pluralize, [
                    [1, 'whale', '1 whale'],
                    [4, 'car', '4 cars'],
                    [0, 'gnat', '0 gnats']
                ]);
            });

            it('includes ensures that the first value passed is one of the arguments, returns boolean', function() {
                check(formatters.includes, [
                    ['admin', 'admin', 'reader', true],
                    ['admin', 'reader', 'admin', true],
                    ['reader', 'reader', 'admin', true],
                    ['editor', 'admin', 'reader', false]
                ]);
            });

            it('and takes the arguments passed, it returns true if all true, false if not', function() {
                check(formatters.and, [
                    ['GorgonEye', 'Blamo', true, true],
                    ['JigglyWiggle', false, true, false],
                    [false, true, '1', false]
                ]);
            });

            it('or takes the arguments passed returns the first truthy one or false if all are false', function() {
                check(formatters.or, [
                    ['admin', 'admin', 'reader', 'admin'],
                    [false, false, false, false],
                    ['gorgonEye', false, 'Duder', 'gorgonEye']
                ]);
            });

            it('not returns true for false and false for true', function() {
                check(formatters.not, [
                    [true, false],
                    [false, true],
                    ['string', false],
                    [0, true]
                ]);
            });
        });
    });