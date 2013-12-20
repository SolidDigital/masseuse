define(['./rivetView'], function(rivetView) {
    'use strict';
    return setViewRiveting;
    function setViewRiveting () {
        if ('auto' === this.rivetConfig) {
            this.model.set('viewId', this.cid);
            this.domEl = this.cid;
            this.rivetView = rivetView({
                rivetScope : '#' + this.cid,
                rivetPrefix : 'rv'
            }).methodWithActualOptions;
        } else if (this.rivetConfig) {
            this.rivetView = rivetView({
                rivetScope : this.rivetConfig.scope,
                rivetPrefix : this.rivetConfig.prefix,
                instaUpdateRivets : (this.rivetConfig.instaUpdateRivets ? true : false)
            }).methodWithActualOptions;
        }
    }
});