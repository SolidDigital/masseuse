define(['underscore', './view', './binders', './formatters'],
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


            defaultFormatters = _.reduce(this.rivetFormatters, function(defaultFormatters, formatterObj) {
                return _.extend(defaultFormatters, formatterObj);
            }, defaultFormatters);

            defaultBinders = _.reduce(this.rivetBinders, function(defaultBinders, binderObj) {
                return _.extend(defaultBinders, binderObj);
            }, defaultBinders);

            console.log(defaultFormatters);
            console.log(defaultBinders);

            if ('auto' === this.rivetConfig) {
                this.rivetView = rivetView({
                    rivetScope : '#' + this.cid,
                    rivetPrefix : 'rv',
                    rivetFormatters : defaultFormatters,
                    rivetBinders : defaultBinders
                }).methodWithActualOptions;
            } else if (this.rivetConfig) {
                this.rivetView = rivetView({
                    rivetScope : this.rivetConfig.scope,
                    rivetPrefix : this.rivetConfig.prefix,
                    rivetFormatters : defaultFormatters,
                    rivetBinders : defaultBinders,
                    instaUpdateRivets : (this.rivetConfig.instaUpdateRivets ? true : false)
                }).methodWithActualOptions;
            }
        }
    });