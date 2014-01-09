define(['jquery'], function ($) {
    'use strict';

    return {
        addclass : function (el, value) {
            if (el.addedClass) {
                $(el).removeClass(el.addedClass);
                delete el.addedClass;
            }

            if (value) {
                $(el).addClass(value);
                el.addedClass = value;
            }
        },
        width : function (el, value) {
            el.style.width = value;
        }
    };
});