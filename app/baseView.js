define(['backbone', 'underscore', 'channels', 'mixin'], function (Backbone, _, channels, mixin) {

    var BaseView = Backbone.View.extend({
        options : {
            name : 'BaseView'
        },
        initialize : initialize,
        start : start,
        render : render,
        dataToJSON : dataToJSON,
        selectorsForCache : [],
        cachedElements: {}
    });

    function initialize () {
        var ModelType = this.options.ModelType || Backbone.Model;
        if (this.options.templateHtml) {
            this.template = _.template(this.options.templateHtml);
        }
        if (this.options.modelData) {
            this.model = new ModelType(this.options.modelData);
        }
    }

    function start () {
        var $deferred = new $.Deferred();


        $
            .when(_runLifeCycleMethod.call(this, this.beforeRender, 'BeforeRender'))
            .then(
                _lifeCycleMethodReference.call(this, this.render, 'Render'),
                _rejectStart.call(this, $deferred))
            .then(
                _lifeCycleMethodReference.call(this, this.afterRender, 'AfterRender'),
                _rejectStart.call(this, $deferred))
            .then(
                _resolveStart.call(this, $deferred),
                _rejectStart.call(this, $deferred));

        return $deferred.promise();
    }

    function render () {
        var self = this;
        if (this.$el && this.template) {
            this.$el.html(this.template(this.dataToJSON()));
        }
        _.forEach(this.options.selectorsForCache, function(selector) {
            self.cachedElements[selector] = self.$el.find(selector);
        });
    }

    function dataToJSON () {
        return this.model ? this.model.toJSON() : {};
    }

    // Share channels among all Views
    BaseView.prototype.channels = channels;

    // --------------------------
    // Private Methods

    /**
     * Life cycle methods have an event triggered before the run.
     * If a life cycle method has one or more arguments, then the first argument passed in is its deferred.
     * The life cycle method will automatically return this deferred, otherwise it will pass through whatever
     * the method itself returns.
     *
     * @param lifeCycleMethod
     * @param lifeCycleMethodName
     * @returns {*}
     * @private
     */
    function _runLifeCycleMethod (lifeCycleMethod, lifeCycleMethodName) {
        if (!lifeCycleMethod) {
            return undefined;
        }

        return mixin({}, lifeCycleMethod)({
            async : lifeCycleMethod.length,
            preEvent : {
                name : this.options.name + ':on' + lifeCycleMethodName,
                channel : this.channels.views
            }
        }).call(this);
    }

    /**
     * A convenience wrapper for creating life cycle method references.
     * @param lifeCycleMethod
     * @param lifeCycleMethodName
     * @returns {*}
     * @private
     */
    function _lifeCycleMethodReference (lifeCycleMethod, lifeCycleMethodName) {
        return function () {
            return _runLifeCycleMethod.call(this, lifeCycleMethod, lifeCycleMethodName);
        }.bind(this);
    }

    function _resolveStart ($deferred) {
        return function () {
            $deferred.resolve();
        }.bind(this);
    }

    function _rejectStart ($deferred) {
        return function () {
            $deferred.reject();
        }.bind(this);
    }

    return BaseView;
});