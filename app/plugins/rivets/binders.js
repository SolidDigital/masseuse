define(['jquery'], function ($) {
    'use strict';

    return {

        addclass : addClass,
        width : width
    };

    function addClass(el, value) {
        if (el.addedClass) {
            $(el).removeClass(el.addedClass);
            delete el.addedClass;
        }

        if (value) {
            $(el).addClass(value);
            el.addedClass = value;
        }
    }

    function width(el, value) {
        el.style.width = value;
    }
});
