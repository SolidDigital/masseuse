/* jshint loopfunc:true */
define([], function () {
    'use strict';

    return {
        withComma : function (value) {
            return value + ', ';
        },
        joinWithComma: function (value) {
            return value.join(', ');
        },
        withBackslash: function (value) {
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
            if (value === 0) {
                return '0 Bytes';
            }
            i = parseInt(Math.floor(Math.log(value) / Math.log(1024)), 10);
            return Math.round(value / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },
        prettyDate: function (dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        },
        secondsToTime: function (secs) {
            var hours = Math.floor(secs / (60 * 60)),
                divisor_for_minutes = secs % (60 * 60),
                minutes = Math.floor(divisor_for_minutes / 60),
                divisor_for_seconds = divisor_for_minutes % 60,
                seconds = Math.ceil(divisor_for_seconds),
                obj = {
                    'h' : hours,
                    'm' : minutes,
                    's' : seconds
                },
                time = (obj.h) ? ((obj.h > 1) ? obj.h + ' hrs ' : obj.h + ' hr ' ) : '';
            time += (obj.m) ? ((obj.m > 1) ? obj.m + ' mins ' : obj.m + ' min ') : '';
            time += (obj.s) ? ((obj.s > 1) ? obj.s + ' secs ' : obj.s + ' sec ') : '';

            return time;
        },
        dollars: function (amount) {
            return '$' + (amount / 100);
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
        pluralize: function (value, arg) {
            switch (value) {
                case 0 :
                    return value + ' ' + arg + 's';
                case 1 :
                    return value + ' ' + arg;
                default:
                    return value + ' ' + arg + 's';
            }
        },
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
});