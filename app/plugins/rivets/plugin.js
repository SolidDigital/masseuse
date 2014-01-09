define(['underscore', './view'],
    function(_, rivetView) {
    'use strict';
    return setViewRiveting;
        /**
         * Can pass in arrays of binder and formatter objects which will be extended with the rivets binders and
         * formatters on the view.
         * @function
         * @param defaultBindersArray
         * @param defaultFormattersArray
         */
    function setViewRiveting (defaultBindersArray, defaultFormattersArray) {
        this.model.set('viewId', this.cid);

        defaultBindersArray = defaultBindersArray || [];
        defaultFormattersArray = defaultFormattersArray || [];
        this.rivetFormatters = this.rivetFormatters || [];
        this.rivetBinders = this.rivetBinders || [];
        
        defaultFormattersArray.concat(this.rivetFormatters);
        defaultBindersArray.concat(this.rivetBinders);

        if ('auto' === this.rivetConfig) {
            this.rivetView = rivetView({
                rivetScope : '#' + this.cid,
                rivetPrefix : 'rv',
                rivetFormatters : _.extend.apply(null, this.rivetFormatters),
                rivetBinders : _.extend.apply(null, this.rivetBinders)
            }).methodWithActualOptions;
        } else if (this.rivetConfig) {
            this.rivetView = rivetView({
                rivetScope : this.rivetConfig.scope,
                rivetPrefix : this.rivetConfig.prefix,
                rivetFormatters : _.extend.apply(null, this.rivetFormatters),
                rivetBinders : _.extend.apply(null, this.rivetBinders),
                instaUpdateRivets : (this.rivetConfig.instaUpdateRivets ? true : false)
            }).methodWithActualOptions;
        }
    }
});