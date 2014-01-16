define(['underscore', './adapter', './binders', './formatters'],
    function(_, rivetView, defaultBinders, defaultFormatters) {
        'use strict';
        return setViewRiveting;
        /**
         * Can pass in arrays of binder and formatter objects which will be extended with the rivets binders and
         * formatters on the view.
         * @function
         * @param defaultBindersArray
         * @param defaultFormattersArray
         */
        function setViewRiveting () {
            this.model.set('viewId', this.cid);

            defaultBinders = defaultBinders || {};
            defaultFormatters = defaultFormatters || {};
            this.rivetFormatters = this.rivetFormatters || [];
            this.rivetBinders = this.rivetBinders || [];

            this.rivetFormatters = [{}, defaultFormatters].concat(this.rivetFormatters);
            this.rivetBinders = [{}, defaultBinders].concat(this.rivetBinders);

            if ('auto' === this.rivetConfig) {
                this.rivetView = rivetView({
                    rivetPrefix : 'rv',
                    rivetFormatters : _.extend.apply(null, this.rivetFormatters),
                    rivetBinders : _.extend.apply(null, this.rivetBinders)
                }).methodWithActualOptions;
            } else if (this.rivetConfig) {
                this.rivetView = rivetView({
                    rivetPrefix : this.rivetConfig.prefix,
                    rivetFormatters : _.extend.apply(null, this.rivetFormatters),
                    rivetBinders : _.extend.apply(null, this.rivetBinders),
                    instaUpdateRivets : (this.rivetConfig.instaUpdateRivets ? true : false)
                }).methodWithActualOptions;
            }
        }
    });
