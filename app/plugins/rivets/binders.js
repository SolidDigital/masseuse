define(['jquery'], function ($) {
    'use strict';

    return {
        addclass : addClass,
        width : width,
        'on-enter-key-press' : {
            bind : bindKeypress,
            unbind : unbindKeypress
        }
    };

    function callback(el, evt) {
        // listen for the enter key or Blur to save to the model.
        if(evt.keyCode === 13 || evt.type === 'blur') {
            this.view.adapters[':'].set(
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

    function bindKeypress(el) {
        var rivetsView = this,
            $el = $(el);

        $el.on('keypress', function(event) {
            if(event.keyCode === 13) {
                $el.blur();
                rivetsView.view.models.view[rivetsView.keypath](event);
            }
        });
    }

    function unbindKeypress(el) {
        $(el).off('keypress');
    }
});
