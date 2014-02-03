define(['jquery'], function ($) {
    'use strict';

    return {

        addclass : addClass,
        width : width,
        editable : {
            routine: function(el, model) {
                this.view.binders.text.call(this, el, model);
            },
            bind : function(el) {
                var $el = $(el);
                if(!$el.attr('contenteditable')) {
                    $el.attr('contenteditable', true);
                }

                el.addEventListener('keypress', _callback.bind(this, el), false);
                el.addEventListener('blur', _callback.bind(this, el), false);
            },
            unbind: function(el) {
                el.removeEventListener('keypress', _callback.bind(this, el), false);
                el.removeEventListener('blur', _callback.bind(this, el), false);
            }
        }
    };

    function _callback(el, evt) {
        // listen for the enter key or Blur to save to the model.
        if(evt.keyCode === 13 || evt.type === 'blur') {
            this.view.adapters[':'].publish(
                this.model,this.keypath.substring(this.keypath.indexOf(':')+1), el.textContent);
        }

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