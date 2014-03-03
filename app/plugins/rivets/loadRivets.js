/* jshint loopfunc:true, maxdepth:3 */
define(['jquery', 'rivets', 'backbone', 'underscore'],
    function ($, Rivets, Backbone, _) {
        'use strict';

        return function (optionsForRivets) {

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
            if (optionsForRivets.rivetsInstaUpdate) {
                this.$('input').on('keypress paste textInput input',
                    function () {
                        $(this).trigger('change');
                    });
            }

            Rivets.config.templateDelimiters = optionsForRivets.rivetsDelimiters;
            _.extend(Rivets.components, optionsForRivets.rivetsComponents);
            _.extend(Rivets.formatters, optionsForRivets.rivetsFormatters);
            _.extend(Rivets.adapters, optionsForRivets.rivetsAdapters);
            _.extend(Rivets.binders, optionsForRivets.rivetsBinders,
                _createBinders.call(this, optionsForRivets.childViewBinders));
            return Rivets.bind(this.$el, {
                model : this.model,
                view : this,
                collection: this.collection
            });
        };

        function _createBinders(childViewBinders) {
            var self = this,
                binders = {};

            _.each(childViewBinders, function(value, key) {
                binders['new-' + key.toLowerCase()] = function(el, model) {
                    var options = {
                        ViewType : value,
                        appendTo : el
                    };
                    if (model instanceof Backbone.Model) {
                        options.model = model;
                    } else {
                        // No error handling for if model is not an object.
                        // In this way the binder will error out, and that is more debuggable than a silent fail.
                        options.modelData = model;
                    }
                    self.addChild(options);
                };
            });
            return binders;
        }
    });
