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
                var self = this;



                this.callback = function() {
                    self.view.adapters[':'].publish(self.model, self.key.path, el.textContent);
                };

                el.addEventListener('input', this.callback, false);
            },
            unbind: function(el) {
                el.removeEventListener('input', this.callback, false);
            }
        }
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