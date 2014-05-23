define(['underscore'], function (_) {
    'use strict';

    return {
        _: _formatter,
        and: and,
        booleantoenabled : booleantoenabled,
        centsToDollars: centsToDollars,
        asDollars : asDollars,
        equals: equals,
        existsOr: existsOr,
        humanize: {
            read : read,
            publish : publish
        },
        includes: includes,
        joinWithComma: joinWithComma,
        jsonAsString: jsonAsString,
        limit: limit,
        not: not,
        or: or,
        pluralize: pluralize,
        prefix : prefix,
        prettyDate: prettyDate,
        prettyDateNoTime : prettyDateNoTime,
        prettyFileSize: prettyFileSize,
        secondsToTime: secondsToTime,
        spaceBefore: spaceBefore,
        spaceAfter: spaceAfter,
        suffix: suffix,
        withColon: withColon,
        withComma : withComma,
        withForwardSlash: withForwardSlash
    };

    function _formatter(value, arg) {
        return _[arg](value);
    }

    function withComma(value) {
        return value + ', ';
    }

    function joinWithComma(value) {
        return value.join(', ');
    }

    function pluralize(value, arg) {
        switch (value) {
        case 0 :
            return value + ' ' + arg + 's';
        case 1 :
            return value + ' ' + arg;
        default:
            return value + ' ' + arg + 's';
        }
    }

    function withForwardSlash(value) {
        return value + ' / ';
    }

    function withColon(value) {
        return value + ' : ';
    }

    function spaceAfter(value) {
        return value + ' ';
    }

    function spaceBefore(value) {
        return ' ' + value;
    }

    function prettyFileSize(value) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
            i;
        value = parseInt(value, 10);
        if (value === 0) {
            return '0 Bytes';
        }
        i = Math.floor(Math.log(value) / Math.log(1024));
        return Math.round(value / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    function prettyDate(dateStr) {
        var date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString('en-US', {hour12: true});
    }

    function prettyDateNoTime(dateStr) {
        var dateString = new Date(dateStr);
        return (dateString.getMonth() + 1) + '/' + dateString.getDate() + '/' + dateString.getFullYear();
    }

    function secondsToTime(secs) {
        var SECONDS_IN_MINUTE = 60,
            SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60,
            HOUR = 'hr',
            MINUTE = 'min',
            SECOND = 'sec',
            hours = Math.floor(secs / SECONDS_IN_HOUR),
            divisor_for_minutes = secs % SECONDS_IN_HOUR,
            minutes = Math.floor(divisor_for_minutes / SECONDS_IN_MINUTE),
            divisor_for_seconds = divisor_for_minutes % SECONDS_IN_MINUTE,
            seconds = Math.ceil(divisor_for_seconds),
            time = [];

        if (0 !== hours) { time.push(pluralize(hours, HOUR)); }
        if (0 !== minutes) { time.push(pluralize(minutes, MINUTE)); }
        if (0 !== seconds) { time.push(pluralize(seconds, SECOND)); }

        return time.join(' ');
    }

    function centsToDollars(amount) {
        return '$' + ((amount / 100).toFixed(2));
    }

    function asDollars(amount) {
        return '$' + amount.toFixed(2);
    }

    function equals(value, args) {
        return (value == args);
    }

    function existsOr(value, args) {
        return value ? value : args;
    }

    function limit(value, args) {
        return value.slice(0, args);
    }

    function read(value) {
        return (value) ? value.charAt(0).toUpperCase() + value.slice(1) : '';
    }

    function publish(value) {
        return (value) ? value.charAt(0).toLowerCase() + value.slice(1) : '';
    }

    function jsonAsString(value) {
        return JSON.stringify(value, null, 4);
    }

    function booleantoenabled(value) {
        return value ? 'Enabled' : 'Disabled';
    }

    function includes() {
        var args = Array.prototype.slice.call(arguments),
            stringToCompare = args.shift();

        if (args.indexOf(stringToCompare) != -1) {
            return true;
        } else {
            return false;
        }
    }

    function prefix(value, pref) {
        return pref + value;
    }

    function suffix(value, suff) {
        return suff + value;
    }

    function not(value) {
        return !value;
    }

    function and() {
        var bool = true;

        _.each(arguments, function(argument) {
            bool = bool && argument;
        });

        return bool;
    }

    function or() {
        var bool = false;

        _.each(arguments, function(argument) {
            bool = bool || argument;
        });

        return bool;
    }
});
