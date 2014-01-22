define(['underscore', './adapter', './binders', './formatters'],
    function(_, rivetView, defaultBinders, defaultFormatters) {
        'use strict';
        return setViewRiveting;
        /**
         * Can pass in arrays of binder and formatter objects which will be extended with the rivets binders and
         * formatters on the view.
         * @function
         *
         */
        function setViewRiveting (options) {
            var rivetsOptions;
            defaultBinders = defaultBinders || {};
            defaultFormatters = defaultFormatters || {};

            options.rivetsFormatters =
                [{}, defaultFormatters].concat(options.rivetsFormatters || options.rivetFormatters);
            options.rivetsBinders =
                [{}, defaultBinders].concat(options.rivetsBinders || options.rivetBinders);

            rivetsOptions = {
                rivetsPrefix : options.rivetsPrefix || options.rivetPrefix || 'data-rv',
                rivetsDelimiters : options.rivetsDelimiters || options.rivetDelimiters || ['{{', '}}'],
                rivetsFormatters : _.extend.apply(_, options.rivetsFormatters),
                rivetsBinders : _.extend.apply(_, options.rivetsBinders)
            };

            if (options.rivetsConfig || options.rivetConfig) {
                this.rivetView = rivetView.bind(this, rivetsOptions);
            }
        }
    });
