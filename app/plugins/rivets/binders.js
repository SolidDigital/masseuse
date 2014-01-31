define(['jquery'], function ($) {
    'use strict';

    return {

        addclass : addClass,
        width : width,
        content : {
            routine: function(el, model) {
                this.view.binders.text.call(this, el, model);
            },
            bind : function(el) {
                el.addEventListener('input', _callback.bind(this,el), false);
            },
            unbind: function(el) {
                el.removeEventListener('input', _callback.bind(this,el), false);
            }
        }
    };

    function _callback(el) {
        this.view.adapters[':'].publish(this.model,this.keypath.substring(this.keypath.indexOf(':')+1), el.textContent);
    }

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