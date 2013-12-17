define(['./rivetView'], function(rivetView) {
    'use strict';
    return setViewRiveting;
    function setViewRiveting () {
        if ('auto' === this.options.rivetConfig) {
            this.model.set('viewId', this.cid);
            this.domEl = this.cid;
            this.rivetView = rivetView({
                rivetScope : '#' + this.cid,
                rivetPrefix : 'rv'
            }).methodWithActualOptions;
        } else if (this.options.rivetConfig) {
            this.rivetView = rivetView({
                rivetScope : this.options.rivetConfig.scope,
                rivetPrefix : this.options.rivetConfig.prefix,
                instaUpdateRivets : (this.options.rivetConfig.instaUpdateRivets ? true : false)
            }).methodWithActualOptions;
        }
    }
});