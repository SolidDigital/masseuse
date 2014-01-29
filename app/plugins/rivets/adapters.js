/* jshint loopfunc:true, maxdepth:3 */
define(['jquery', 'rivets', 'backbone'],
    function ($, Rivets, Backbone) {
        'use strict';

        var keySeparator = /->/g;

        /**
         * @namespace adapter
         */
        return {
            ':' :  {

                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 * @param callback
                 */
                subscribe : function (model, keypath, callback) {
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
                },

                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 */
                unsubscribe : function (model, keypath) {
                    if (typeof (model) == 'undefined') {
                        return;
                    }
                    if (model instanceof Backbone.Collection) {
                        model.off('add remove reset change');
                    } else if (model.off) {
                        model.off('change:' + keypath.replace(keySeparator,'.'));
                    }
                },

                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 * @returns {*}
                 */
                read : function (model, keypath) {
                    if(model instanceof Backbone.Collection) {
                        return model.models;
                    }
                    return model.get(keypath.replace(keySeparator,'.'));
                },
                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 * @param value
                 */
                publish : function (model, keypath, value) {
                    if (model instanceof Backbone.Model) {
                        model.set(keypath.replace(keySeparator,'.'), value);
                    }
                }
            }
        };
    });
