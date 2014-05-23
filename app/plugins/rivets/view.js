define(['../../views/baseView', './plugin'], function(BaseView, plugin) {
    'use strict';
    return BaseView.extend({
        initialize : initialize
    });

    /**
     *
     * RivetView is in the plugins: `masseuse.plugin.rivets.RivetsView`
     *
     * ```javascript
     * RivetView = masseuse.plugin.rivets.RivetsView;
     * rivetView = new RivetView({
     *  el : '#blah',
     *  templateHtml : '<div>{{data.title}}</div>',
     *  modelData : {
     *      title : 'There it is.'
     *  }
     * }).start();
     * ```
     *
     * After the view starts, the following html:
     *
     * ```html
     * <div id="blah"></div>
     * ```
     *
     * will be riveted to `rivetView.model` and the html will look like:
     *
     * ```html
     * <div id="blah">
     * <div>There it is.</div>
     * </div>
     * ```
     *
     * [See the Rivets.js Repo for more information. ](https://github.com/mikeric/rivets/wiki)
     *
     * @namespace masseuse/plugins/rivets/RivetsView
     * @param options
     */
    function initialize (options) {
        options.plugins = options.plugins || [];
        options.plugins.push(plugin);
        BaseView.prototype.initialize.call(this, options);
    }
});
