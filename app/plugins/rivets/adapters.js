/* jshint loopfunc:true, maxdepth:3 */
define(['jquery', 'rivets', 'backbone'],
    function ($, Rivets, Backbone) {
        'use strict';

        var keySeparator = /->/g;

        /**
         * Custom rivets adapter using : that works with Backbone.Models and Backbone.Collections.
         * To access fields on Collections, use "->".
         * To iterate over a collection use, "collection:"
         */
        return {
            ':' :  {
                subscribe : subscribe,
                unsubscribe : unsubscribe,
                read : read,
                publish : publish
            }
        };

        function subscribe(model, keypath, callback) {
            keypath = keypath.replace(keySeparator,'.');
            if (model instanceof Backbone.Collection) {
                model.on('add remove reset change', function (obj, keypath) {
                    callback(obj.get(keypath));
                });
            } else if (model instanceof Backbone.Model) {
                model.on('change', function () {
                    // TODO: make this more efficient / specific
                    callback(model.get(keypath));
                });
            }
        }

        function unsubscribe(model, keypath) {
            if (typeof (model) == 'undefined') {
                return;
            }
            if (model instanceof Backbone.Collection) {
                model.off('add remove reset change');
            } else if (model.off) {
                model.off('change:' + keypath.replace(keySeparator,'.'));
            }
        }

        function read(model, keypath) {
            if(model instanceof Backbone.Collection) {
                return model.models;
            }
            return model.get(keypath.replace(keySeparator,'.'));
        }

        function publish(model, keypath, value) {
            if (model instanceof Backbone.Model) {
                model.set(keypath.replace(keySeparator,'.'), value);
            }
        }
    });
