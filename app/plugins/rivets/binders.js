define(['jquery'], function ($) {
    'use strict';

    /**
     * @namespace binders
     */
    return {

        addclass : addClass,
        width : width
    };

    /**
     * Example usage in a rivets template is `data-rv-addClass="data.className"`
     * @memberof binders
     * @instance
     * @param el
     * @param value
     */
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

    /**
     * Usage in a rivets template is `data-rv-width="data.theWidth"`
     * @memberof binders
     * @instance
     * @param el
     * @param value
     */
    function width(el, value) {
        el.style.width = value;
    }
});
