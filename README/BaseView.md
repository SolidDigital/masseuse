## BaseView

The BaseView is a custom extension of Backbone.View with some built in functionality and a defined life cycle. The life
cycle methods can be run either synchronously or asynchronously.

To initialize a BaseView, there are several choices of options to pass in:

```javascript
var view = new BaseView({
    name : 'MyName',
        // A string that can later be used to identify the view
    appendView : false,
        // If truthy this view will be appended to this.$el
        // If falsey this view will be the innerHtml of this.$el
    ModelType : MyCustomModel,
        // The model "class" to be used for this.model
        // If left undefined or falsey Backbone.Model is used by default
    modelData : { ... },
        // The data the ModelType will be initialized with 
    bindings : [
        ['model', 'change:price', 'showNewPrice'],
        ['model', 'change:discount', 'animateAdvertisement']
    ],
        // Bindings are a shortcut for adding event listeners to a view.
        // They are arrays of strings. The context is assumed to be the view.
    templateHtml : '<div><%= price %> : <%= discount %></div>',
        // Underscore templating that will - if provided - be turned into this.template using _.template(templateHtml)

});
```
