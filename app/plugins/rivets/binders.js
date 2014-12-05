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
