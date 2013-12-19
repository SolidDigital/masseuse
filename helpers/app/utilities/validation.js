define(['underscore'], function (_) {
    'use strict';
    return {
        stringHasLength : function (string) {
            return !!(string && string.constructor === String);
        },
        checkBoxChecked : function (value) {
            return value;
        },
        isEmail : function (email) {
            return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(email);
        },
        minLength : function (string, minimumLength) {
            return string.length >= minimumLength;
        },
        maxLength : function (string, maximumLength) {
            return string.length <= maximumLength;
        },
        isCurrency : function (string) {
            return (/^\$-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(string);
        },
        isNumeric : function (string) {
            return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(string);
        },
        isAlpha : function (string) {
            return (/^[a-z]+$/i).test(string);
        },
        isAlphaNumeric : function (string) {
            return (/^[a-z0-9]+$/i).test(string);
        },
        isBetween : function (string, min, max) {
            return string.length >= min && string.length <= max;
        },
        isCreditCard : function (string) {
            var valid = (/^[\d-\s]+$/).test(string);
            if (!valid) {
                return false;
            }

            return this.validateLuhn(string);
        },
        validateLoginAttribute : function (string) {
            return (/^[\w.\-]+$/).test(string);
        },
        validateLuhn : function (number) {
            var digit, n, sum, _len, _ref;
            sum = 0;
            _ref = number.split('').reverse().join('');
            for (n = 0, _len = _ref.length; n < _len; n++) {
                digit = _ref[n];
                digit = +digit;
                if (n % 2) {
                    digit *= 2;
                    if (digit < 10) {
                        sum += digit;
                    } else {
                        sum += digit - 9;
                    }
                } else {
                    sum += digit;
                }
            }
            return sum % 10 === 0;
        },
        createErrorMessages : function () {
            return _.unique(_.compact(arguments));
        },
        checkForErrors : function () {
            return _.find(arguments, function (theArgument) {
                return !!theArgument;
            }) ? true : false;
        }

    };
});