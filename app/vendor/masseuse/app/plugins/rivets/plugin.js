define(['underscore', './loadRivets', './binders', './formatters', './adapters'],
    function(_, rivetView, defaultBinders, defaultFormatters, defaultAdapters) {
        'use strict';
        return setViewRiveting;
        /**
         * Can pass in arrays of binder and formatter objects which will be extended with the rivets binders and
         * formatters on the view.
         * @function
         *
         */
        function setViewRiveting (options) {
            var rivetsOptions,
                rivetedView;

            if (false === options.rivetsConfig || false === options.rivetConfig) {
                return;
            }

            defaultBinders = defaultBinders || {};
            defaultAdapters = defaultAdapters || {};
            defaultFormatters = defaultFormatters || {};

            options.rivetsComponents =
                [{}].concat(options.rivetsComponents || options.rivetComponents);
            options.rivetsFormatters =
                [{}, defaultFormatters].concat(options.rivetsFormatters || options.rivetFormatters);
            options.rivetsAdapters =
                [{}, defaultAdapters].concat(options.rivetsAdapters || options.rivetAdapters);
            options.rivetsBinders =
                [{}, defaultBinders].concat(options.rivetsBinders || options.rivetBinders);

            rivetsOptions = {
                rivetsInstaUpdate : options.rivetsInstaUpdate,
                rivetsDelimiters : options.rivetsDelimiters || options.rivetDelimiters || ['{{', '}}'],
                rivetsPrefix : options.rivetsPrefix || options.rivetPrefix || 'data-rv',
                rivetsComponents : _.extend.apply(_, options.rivetsComponents),
                rivetsFormatters : _.extend.apply(_, options.rivetsFormatters),
                rivetsAdapters : _.extend.apply(_, options.rivetsAdapters),
                rivetsBinders : _.extend.apply(_, options.rivetsBinders)
            };

            this.listenTo(this, 'afterTemplatingDone', function() {
                rivetedView = rivetView.call(this, rivetsOptions);
            });

            this.listenTo(this, 'onRemove', function () {
                if (!rivetedView) {
                    rivetedView.unbind();
                }
            });
        }
    });
