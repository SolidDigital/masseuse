(function () {
    'use strict';

// Require.js allows us to configure shortcut alias
    require.config({
        shim : {
            underscore : {
                exports : '_'
            },
            mocha : {
                exports : 'mocha'
            },
            sinon : {
                exports : 'sinon'
            }
        },
        paths : {
            jquery : '../app/vendor/jquery/jquery',
            rivets : '../app/vendor/rivets/dist/rivets',
            backbone : '../app/vendor/backbone-amd/backbone',
            text : '../app/vendor/requirejs-text/text',
            mocha : '../app/vendor/mocha/mocha',
            chai : '../app/vendor/chai/chai',
            squire : '../app/vendor/squire/src/Squire',
            sinon : '../app/vendor/sinon/lib/sinon',
            sinonSpy : '../app/vendor/sinon/lib/sinon/spy',
            sinonChai : '../app/vendor/sinon-chai/lib/sinon-chai',
            sinonCall : '../app/vendor/sinon/lib/sinon/call',
            check : './check'
        },
        packages : [
            {
                name : 'underscore',
                location : '../app/vendor/lodash-amd/underscore'
            },
            {
                name : 'masseuse',
                location : '../app'
            }
        ]
    });

    require([
        'mocha',
        './views/baseViewTests',
        './views/lifeCycleTests',
        './views/viewContextTests',
        './models/masseuseModelTests',
        './models/computedPropertyTests',
        './models/proxyPropertyTests',
        './utilities/channelsTests'
    ], function (mocha) {
        mocha.run();
    });
}());