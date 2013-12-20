define(['./rivetView'], function(rivetView) {
    'use strict';
    return setViewRiveting;
    function setViewRiveting () {
        this.model.set('viewId', this.cid);
        if ('auto' === this.rivetConfig) {
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