/*globals mochaPhantomJS:false*/
(function () {
    'use strict';

// Require.js allows us to configure shortcut alias
    require.config({
        shim : {
            mocha : {
                exports : 'mocha'
            },
            sinon : {
                exports : 'sinon'
            },
            sinonCall : {
                deps : ['sinon'],
                exports : 'sinonCall'
            },
            sinonSpy : {
                deps : ['sinonCall'],
                exports : 'sinonSpy'
            },
            sinonStub : {
                deps : ['sinonCall'],
                exports : 'sinonStub'
            },
            sightglass : {
                exports : 'sightglass'
            },
            rivets : {
                deps : ['jquery', 'sightglass'],
                exports : 'rivets'
            }
        },
        paths : {
            jquery : '../app/vendor/jquery/dist/jquery',
            sightglass : '../app/vendor/sightglass/index',
            rivets : '../app/vendor/rivets/dist/rivets',
            backbone : '../app/vendor/backbone-amd/backbone',
            text : '../app/vendor/requirejs-text/text',
            mocha : '../app/vendor/mocha/mocha',
            chai : '../app/vendor/chai/chai',
            sinon : '../app/vendor/sinon/lib/sinon',
            sinonSpy : '../app/vendor/sinon/lib/sinon/spy',
            sinonChai : '../app/vendor/sinon-chai/lib/sinon-chai',
            sinonCall : '../app/vendor/sinon/lib/sinon/call',
            sinonStub : '../app/vendor/sinon/lib/sinon/stub',
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
        './package/packageTests',
        './views/baseViewTests',
        './views/lifeCycleTests',
        './views/viewContextTests',
        './models/masseuseModelTests',
        './models/computedPropertyTests',
        './models/proxyPropertyTests',
        './models/observerPropertyTests',
        './collections/masseuseCollectionTests',
        './plugins/rivets/viewTests',
        './plugins/rivets/rivetsBackBoneCollectionsTests',
        './plugins/rivets/collectionWithMasseuseModelsTests',
        './plugins/rivets/componentsTest',
        './plugins/rivets/binderTests',
        './plugins/rivets/formattersTests',
        './utilities/channelsTests',
        './utilities/createOptionsTests',
        './utilities/deferMethodTests',
        './routers/masseuseRouterTests.js'
    ], function (mocha) {
        if (typeof mochaPhantomJS !== 'undefined') {
            mochaPhantomJS.run();
        } else {
            mocha.run();
        }
    });
}());
