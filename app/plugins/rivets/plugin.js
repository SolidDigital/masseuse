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

            defaultBinders = defaultBinders || {};
            defaultFormatters = defaultFormatters || {};
            options.rivetFormatters = options.rivetFormatters || [];
            options.rivetBinders = options.rivetBinders || [];

            options.rivetFormatters = [{}, defaultFormatters].concat(options.rivetFormatters);
            options.rivetBinders = [{}, defaultBinders].concat(options.rivetBinders);

            if (options.rivetConfig) {
                this.rivetView = rivetView.bind(this, {
                    rivetPrefix : options.rivetPrefix || 'data-rv',
                    rivetDelimiters : options.rivetDelimiters || ['{{', '}}'],
                    rivetFormatters : _.extend.apply(_, options.rivetFormatters),
                    rivetBinders : _.extend.apply(_, options.rivetBinders)
                });
            }
        }
    });
