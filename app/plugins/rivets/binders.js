define(['jquery'], function ($) {
    'use strict';

    return {
        addclass : addClass,
        editable : {
            routine: routineEditable,
            bind : bindEditable,
            unbind: unbindEditable
        },
        width : width,
        'on-enter-key-press' : {
            bind : bindKeypress,
            unbind : unbindKeypress
        }
    };

    function bindEditable(el) {
        var $el = $(el);
        if(!$el.attr('contenteditable')) {
            $el.attr('contenteditable', true);
        }

        this.callback = callback.bind(this, el);
        $el.on('keypress', this.callback);
        $el.on('blur', this.callback);
    }

    function unbindEditable(el) {
        var $el = $(el);
        $el.off('keypress');
        $el.off('blur');
    }

    function routineEditable(el, model) {
        this.view.binders.text.call(this, el, model);
    }

    function callback(el, evt) {
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