define(['view/baseView', './channels', './mixin', 'views/rivetView', 'views/viewContext', 'deferredHelper'], function(
    BaseView,
    channels,
    mixin,
    rivetView,
    ViewContext,
    DeferredHelper
    ) {

    return {
        BaseView : BaseView,
        channels : channels,
        DeferredHelper : DeferredHelper,
        mixin : mixin,
        rivetView : rivetView,
        ViewContext : ViewContext
    }
});