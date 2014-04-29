define(['masseuse', './view'], function(masseuse, RivetsView) {
    'use strict';

    return loadRivets;

    function loadRivets() {
        masseuse.plugins.rivets = masseuse.plugins.rivets || {};
        masseuse.plugins.rivets.View = masseuse.plugins.rivets.View || RivetsView;
        return masseuse;
    }
});