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

            if (false === options.rivetsConfig) {
                return;
            }

            rivetsOptions = 'object' === typeof options.rivetsConfig ? options.rivetsConfig : {};

            rivetsOptions = {
                instaUpdate : rivetsOptions.instaUpdate,
                delimiters : rivetsOptions.delimiters || ['{{', '}}'],
                prefix : options.prefix || 'data-rv',
                components : _.extend.apply(_, [{}].concat(rivetsOptions.components)),
                formatters : _.extend.apply(_, [defaultFormatters].concat(rivetsOptions.formatters)),
                adapters : _.extend.apply(_, [defaultAdapters].concat(rivetsOptions.adapters)),
                binders : _.extend.apply(_, [defaultBinders].concat(rivetsOptions.binders)),
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
