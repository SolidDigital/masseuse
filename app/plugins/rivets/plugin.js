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
                rivetedViews;

            if (false === options.rivetsConfig || false === options.rivetConfig) {
                return;
            }

            rivetsOptions = 'object' === typeof options.rivetsConfig ? options.rivetsConfig : {};


            defaultBinders = defaultBinders || {};
            defaultAdapters = defaultAdapters || {};
            defaultFormatters = defaultFormatters || {};

            rivetsOptions.rivetsComponents =
                [{}].concat(rivetsOptions.components || options.rivetsComponents || options.rivetComponents);
            rivetsOptions.rivetsFormatters =
                [{}, defaultFormatters].concat(
                    rivetsOptions.formatters || options.rivetsFormatters || options.rivetFormatters);
            rivetsOptions.rivetsAdapters =
                [{}, defaultAdapters].concat(
                    rivetsOptions.adapters || options.rivetsAdapters || options.rivetAdapters);
            rivetsOptions.rivetsBinders =
                [{}, defaultBinders].concat(
                    rivetsOptions.binders || options.rivetsBinders || options.rivetBinders);
            if (undefined === rivetsOptions.rivetsInstaUpdate) {
                rivetsOptions.instaUpdate = options.rivetsInstaUpdate;
            }
            rivetsOptions.rivetsDelimiters =
                rivetsOptions.delimiters || options.rivetsDelimiters || options.rivetDelimiters;
            rivetsOptions.rivetsPrefix =
                rivetsOptions.prefix || options.rivetsPrefix || options.rivetPrefix;

            rivetsOptions = {
                rivetsInstaUpdate : rivetsOptions.instaUpdate,
                rivetsDelimiters : rivetsOptions.rivetsDelimiters || ['{{', '}}'],
                rivetsPrefix : options.rivetsPrefix || 'data-rv',
                rivetsComponents : _.extend.apply(_, rivetsOptions.rivetsComponents),
                rivetsFormatters : _.extend.apply(_, rivetsOptions.rivetsFormatters),
                rivetsAdapters : _.extend.apply(_, rivetsOptions.rivetsAdapters),
                rivetsBinders : _.extend.apply(_, rivetsOptions.rivetsBinders),
                childViewBinders : rivetsOptions.childViewBinders,
                skipRoot : rivetsOptions.skipRoot || options._rivetsSkipRoot
            };

            this.listenTo(this, 'afterTemplatingDone', function() {
                rivetedViews = rivetView.call(this, rivetsOptions);
            });

            this.listenTo(this, 'onRemove', function () {
                if (rivetedViews) {
                    _.each(rivetedViews, function(view) {
                        view.unbind();
                    });
                }
            });
        }
    });
