/* jshint loopfunc:true */
define(function () {
    'use strict';

    return {
        withComma : function (value) {
            return value + ', ';
        },
        joinWithComma: function (value) {
            return value.join(', ');
        },
        withForwardSlash: function (value) {
            return value + ' / ';
        },
        withColon: function (value) {
            return value + ' : ';
        },
        spaceAfter: function (value) {
            return value + ' ';
        },
        spaceBefore: function (value) {
            return ' ' + value;
        },
        prettyFileSize: function (value) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
                i;
            value = parseInt(value, 10);
            if (value === 0) {
                return '0 Bytes';
            }
            i = Math.floor(Math.log(value) / Math.log(1024));
            return Math.round(value / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },
        prettyDate: function (dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        },
        secondsToTime: function (secs) {
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
        },
        dollars: function (amount) {
            return '$' + ((amount / 100).toFixed(2));
        },
        equals: function (value, args) {
            return (value === args);
        },
        exists: function (value, args) {
            return value ? value : args;
        },
        limit: function (value, args) {
            return value.slice(0, args);
        },
        humanize: function (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        jsonAsString: function (value) {
            return JSON.stringify(value);
        },
        pluralize: pluralize,
        includes: function () {
            var args = Array.prototype.slice.call(arguments),
                stringToCompare = args.shift();

            if (args.indexOf(stringToCompare) != -1) {
                return true;
            } else {
                return false;
            }
        }
    };

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
});