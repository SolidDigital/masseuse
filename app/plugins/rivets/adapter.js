/* jshint loopfunc:true, maxdepth:3 */
define(['jquery', 'rivets', './configureMethod', 'backbone', 'underscore'],
    function ($, Rivets, configureMethod, Backbone, _) {
        'use strict';

        var keySeparator = /->/g;

        /**
         * @namespace adapter
         */
        return function (optionsForRivets) {
            Rivets.adapters[':'] =  {
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
                        model.on('add remove reset refresh', function (obj, keypath) {
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
                        model.off('add remove reset refresh');
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
                    if (model instanceof Backbone.Collection) {
                        model[keypath.replace(keySeparator,'.')] = value;
                    } else if (model instanceof Backbone.Model) {
                        model.set(keypath.replace(keySeparator,'.'), value);
                    }
                }
            };
            Rivets.configure({
                preloadData : true,
                prefix : optionsForRivets.rivetsPrefix,
                // This fires when you use data-rv-on-click.
                handler : function(context, ev, binding) {
                    this.call(binding.model, ev, binding.view.models);
                }
            });
            // Rivets works off of listening to the change event, which doesn't happen on inputs until loss of focus
            // Work around that if desired
            if (optionsForRivets.instaUpdateRivets) {
                this.$('input').on('keypress paste textInput input',
                    function () {
                        $(this).trigger('change');
                    });
            }

            Rivets.config.templateDelimiters = optionsForRivets.rivetsDelimiters;

            _.extend(Rivets.formatters, optionsForRivets.rivetsFormatters);
            _.extend(Rivets.binders, optionsForRivets.rivetsBinders);

            // bind data to rivets values.
            return Rivets.bind(this.$el, {model : this.model, view : this});

        };
    });
