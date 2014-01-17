/* jshint loopfunc:true, maxdepth:3 */
define(['jquery', 'rivets', './configureMethod', 'backbone', 'underscore'],
    function ($, Rivets, configureMethod, Backbone, _) {
        'use strict';

        /**
         * Adapter originally from https://gist.github.com/mogadanez/5728747
         */

        // TODO: remove configureMethod, it is not really being used here

        /**
         * @namespace adapter
         */
        return configureMethod({
            rivetScope : undefined,
            rivetPrefix : undefined,
            instaUpdateRivets : false
        }, function (config) {
            Rivets.adapters[':'] =  {
                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 * @param callback
                 */
                subscribe : function (model, keypath, callback) {
                    if (model instanceof Backbone.Collection) {
                        model.on('add remove reset refresh', function (obj, keypath) {
                            callback(obj.get(keypath.replace(/_/g,'.')));
                        });
                    } else if (model instanceof Backbone.Model) {
                        console.log(keypath);
                        model.on('change:' + keypath.replace(/_/g,'.'), function (key, m, v) {
                            console.log(arguments);
                            callback(v);
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
                        model.off('add remove reset refresh');
                    } else if (model.off) {
                        model.off('change:' + keypath.replace(/_/g,'.'));
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
                    return model.get(keypath.replace(/_/g,'.'));
                },
                /**
                 * @memberof adapter
                 * @instance
                 * @param model
                 * @param keypath
                 * @param value
                 */
                publish : function (model, keypath, value) {
                    if (model instanceof Backbone.Collection) {
                        model[keypath.replace(/_/g,'.')] = value;
                    } else if (result instanceof Backbone.Model) {
                        model.set(keypath.replace(/_/g,'.'), value);
                    }
                }
            };
            Rivets.configure({
                preloadData : true,
                prefix : config.rivetPrefix,
                // preloadData: false

                // This fires when you use data-rv-on-click.
                handler : function(context, ev, binding) {
                    this.call(binding.model, ev, binding.view.models);
                }
            });
            // Rivets works off of listening to the change event, which doesn't happen on inputs until loss of focus
            // Work around that if desired
            if (config.instaUpdateRivets) {
                this.elementCache(config.rivetScope + ' input').on('keypress paste textInput input', function () {
                    $(this).trigger('change');
                });
            }

            Rivets.config.templateDelimiters = ['{{', '}}'];

            _.extend(Rivets.formatters, config.rivetFormatters);
            _.extend(Rivets.binders, config.rivetBinders);

            // bind data to rivets values.
            return Rivets.bind(this.$el, {data : this.model, view : this});

        }).methodWithDefaultOptions;
    });
