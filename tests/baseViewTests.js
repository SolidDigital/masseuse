/*global describe:false, it:false, beforeEach:false*/
define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai'], function (_, chai, Squire, mocha, sinon, sinonChai) {

    'use strict';
    var VIEW1_NAME = "testView1",
        CHILD_VIEW_NAME = "childView",
        injector = new Squire(),
        should = chai.should();


    require(['underscore', 'sinonCall', 'sinonSpy']);
    // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
    chai.use(sinonChai);
    mocha.setup('bdd');


    describe("An instance of the BaseView", function () {


        //-----------Setup-----------
        var BaseView,
            viewInstance;

        beforeEach(function (done) {
            injector.require(['baseView'], function (BaseViewIn) {
                    BaseView = BaseViewIn;
                    viewInstance = new BaseView({
                        name : VIEW1_NAME
                    });
                    done();
                },
                function () {
                    console.log('BaseView error.')
                });
        });

        //-----------Tests-----------
        it("should exist", function () {
            should.exist(BaseView);
        });

        describe("start method", function () {
            it("should exist", function () {
                should.exist(viewInstance.start);
            });
            it('should be a function', function () {
                viewInstance.start.should.be.a('function');
            });
            it('should return a promise', function () {
                var promise = viewInstance.start();
                promise.should.have.property('done');
                promise.should.not.have.property('resolve');
            });
            describe("promise", function () {
                // Using done as a spy. If it is not called, the test will fail.
                it('should be resolved after start promise is resolved', function (done) {
                    viewInstance.start().done(done);
                });
                it('should not be resolved immediately after start is called', function () {
                    var $promise = viewInstance.start();
                    $promise.state().should.equal('pending');

                });
                it('should be notified with "beforeRenderDone", "renderDone", and "afterRenderDone" in sequence', function (done) {
                    var eventSpy = sinon.spy();
                    viewInstance.start().progress(function(event){
                        eventSpy(event);
                        if (3 <= eventSpy.callCount) {
                            console.log("done");
                            eventSpy.firstCall.args[0].should.equal('beforeRenderDone');
                            eventSpy.secondCall.args[0].should.equal('renderDone');
                            eventSpy.thirdCall.args[0].should.equal('afterRenderDone');
                            done();
                        }
                    });
                });

            });
            describe("render method", function () {
                it("should exist", function () {
                    should.exist(viewInstance.render);
                });
                it('should be a function', function () {
                    viewInstance.render.should.be.a('function');
                });
                it("should trigger the :preRender event on the view's channel", function (done) {
                    viewInstance.channels.views.on(VIEW1_NAME + ":preRender", function () {
                        done();
                    });
                    viewInstance.start();
                });
                it("should trigger the :postRender event on the view's channel", function (done) {
                    viewInstance.channels.views.on(VIEW1_NAME + ":postRender", function () {
                        done();
                    });
                    viewInstance.start();
                });

            });

            it('should call start on any children', function () {
                var childView = new (BaseView.extend({
                        name: CHILD_VIEW_NAME
                    })),
                    childViewStart = sinon.spy(childView, "start");

                viewInstance.addChild(childView);

                childView.start.should.not.have.been.called;

                viewInstance.start().done(function () {
                    childView.start.should.have.been.calledOnce;
                });
            });

            it("should not render until it's parent has rendered", function () {
                var childView = new (BaseView.extend({
                        name: CHILD_VIEW_NAME,
                        render: function () { }
                    })),
                    childRender = sinon.spy(childView, "render");

                viewInstance.addChild(childView);

                childRender.should.not.have.been.called;

                viewInstance.start()
                    .progress(function (progress) {
                        if (progress === BaseView.beforeRenderDone) {
                            childRender.should.not.have.been.called;
                        } else if (progress === BaseView.renderDone) {
                            _.defer(function () {
                                childRender.should.have.been.calledOnce;
                            });
                        }
                    })
            });
        });

        describe("remove method", function () {
            // method should wrap View.remove
            it('should call stop on all children', function () {
                var childView = new (BaseView.extend({
                        name: CHILD_VIEW_NAME
                    })),
                    childRemove = sinon.spy(childView, "remove");

                viewInstance.addChild(childView);

                childRemove.should.not.have.been.called;

                viewInstance.remove();

                childRemove.should.have.been.calledOnce;
            });
        });

        describe("channels", function () {
//            it("can be triggered by one view and heard by another", function () {
//                //TODO: create a second view instance
//            });
        });

        describe("addChild method", function () {
            it ('should be a method', function () {
                viewInstance.addChild.should.be.a('function');
            });

            it ('should add a child view', function () {
                var childView = new BaseView({
                    name: CHILD_VIEW_NAME
                });

                viewInstance.children.length.should.equal(0);

                viewInstance.addChild(childView);

                viewInstance.children.length.should.equal(1);
            });

            it ('should not add the same child view twice', function () {
                var childView = new BaseView({
                    name: CHILD_VIEW_NAME
                });

                viewInstance.children.length.should.equal(0);

                viewInstance.addChild(childView);

                viewInstance.children.length.should.equal(1);

                viewInstance.addChild(childView);

                viewInstance.children.length.should.equal(1);
            });
        });

        describe("removeChild method", function () {
            it ('should remove a child view, if it exists', function () {
                var childView = new BaseView({
                    name: CHILD_VIEW_NAME
                });

                viewInstance.addChild(childView);

                viewInstance.children.length.should.equal(1);

                viewInstance.removeChild(childView);

                viewInstance.children.length.should.equal(0);
            });

            it ('should not remove any child views if a matching view is not found', function () {
                var childView = new BaseView({
                        name: CHILD_VIEW_NAME
                    }),
                    anotherChildView = new BaseView({
                        name: "Another Child"
                    });

                viewInstance.addChild(childView);

                viewInstance.children.length.should.equal(1);

                viewInstance.removeChild(anotherChildView);

                viewInstance.children.length.should.equal(1);
            });
        });
    });

    describe("An instance of extending the BaseView", function () {

        //-----------Setup-----------
        var BaseView,
            AsyncExtendedBaseView,
            SyncExtendedBaseView,
            asyncInstance,
            syncInstance,
            $beforeRenderDeferred,
            $afterRenderDeferred;


        beforeEach(function (done) {
            injector.require(['baseView'], function (BaseViewIn) {

                    BaseView = BaseViewIn;
                    AsyncExtendedBaseView = BaseView.extend({
                        beforeRender : function (deferred) {
                            $beforeRenderDeferred = deferred;
                        },
                        afterRender : function (deferred) {
                            $afterRenderDeferred = deferred;
                        }
                    });
                    SyncExtendedBaseView = BaseView.extend({
                        beforeRender : function () {
                        },
                        afterRender : function () {
                        }
                    });

                    asyncInstance = new AsyncExtendedBaseView({
                        name : VIEW1_NAME
                    });
                    syncInstance = new SyncExtendedBaseView({
                        name : VIEW1_NAME
                    });

                    done();
                },
                function () {
                    console.log('BaseView error.')
                });
        });

        describe("beforeRender method, if implemented", function () {
            it("should trigger the :preBeforeRender event on the view's channel during start()", function (done) {
                syncInstance.channels.views.on(VIEW1_NAME + ":preBeforeRender", function () {
                    done();
                });
                syncInstance.start();
            });
            it("should trigger the :postBeforeRender event on the view's channel during start()", function (done) {
                syncInstance.channels.views.on(VIEW1_NAME + ":postBeforeRender", function () {
                    done();
                });
                syncInstance.start();
            });

            // NOTE: xing out a describe or it will disable it and highlight it blue
            describe("with zero arguments", function () {
                it("will trigger the beforeRender event, then the render event, then afterRender event in that order", function () {

                    var BeforeRender = sinon.spy(syncInstance, "beforeRender"),
                        Render = sinon.spy(syncInstance, "render"),
                        AfterRender = sinon.spy(syncInstance, "afterRender");

                    syncInstance.start().done(function() {
                        BeforeRender.should.have.been.calledOnce;
                        Render.should.have.been.calledOnce;
                        AfterRender.should.have.been.calledOnce;

                        BeforeRender.should.have.been.calledBefore(Render);
                        BeforeRender.should.have.been.calledBefore(AfterRender);
                        Render.should.have.been.calledAfter(BeforeRender);
                        Render.should.have.been.calledBefore(AfterRender);
                        AfterRender.should.have.been.calledAfter(BeforeRender);
                        AfterRender.should.have.been.calledAfter(Render);
                    });
                });
            });
            describe("with one argument", function () {
                it("will fail the start method if its deferred is rejected", function (done) {
                    asyncInstance.start().fail(done);
                    $beforeRenderDeferred.reject();
                });
                it("will not call the afterRender method if its deferred is rejected", function (done) {
                    var AfterRender = sinon.spy(asyncInstance, "afterRender");
                    asyncInstance.start().fail(done);
                    $beforeRenderDeferred.reject();
                    AfterRender.should.not.have.been.called;
                });
            });
        });

        describe("afterRender method, if implemented", function () {
            it("should trigger the :preAfterRender event on the view's channel during start()", function (done) {
                syncInstance.channels.views.on(VIEW1_NAME + ":preAfterRender", function () {
                    done();
                });
                syncInstance.start();
            });
            it("should trigger the :postAfterRender event on the view's channel during start()", function (done) {
                syncInstance.channels.views.on(VIEW1_NAME + ":postAfterRender", function () {
                    done();
                });
                syncInstance.start();
            });
            describe("with zero arguments", function () {
                it("will trigger the beforeRender event, then the render event, then afterRender event in that order", function () {
                    var BeforeRender = sinon.spy(syncInstance, "beforeRender"),
                        Render = sinon.spy(syncInstance, "render"),
                        AfterRender = sinon.spy(syncInstance, "afterRender");

                    syncInstance.start().done(function() {
                        BeforeRender.should.have.been.calledOnce;
                        Render.should.have.been.calledOnce;
                        AfterRender.should.have.been.calledOnce;

                        BeforeRender.should.have.been.calledBefore(Render);
                        BeforeRender.should.have.been.calledBefore(AfterRender);
                        Render.should.have.been.calledAfter(BeforeRender);
                        Render.should.have.been.calledBefore(AfterRender);
                        AfterRender.should.have.been.calledAfter(BeforeRender);
                        AfterRender.should.have.been.calledAfter(Render);
                    });
                });
            });
            describe("with one argument", function () {
                it("will fail the start method if its deferred is rejected", function (done) {
                    asyncInstance.start().fail(done);
                    _.defer(function() {
                        $beforeRenderDeferred.resolve();
                        $afterRenderDeferred.reject();
                    });
                });
                it("will not call the afterRender method if the beforeRender deferred is rejected", function (done) {
                    var AfterRender = sinon.spy(asyncInstance, "afterRender");
                    asyncInstance.start().fail(function() {
                        AfterRender.should.not.have.been.called;
                        done();
                    });
                    _.defer(function() {
                        $beforeRenderDeferred.reject();
                    });
                });
            });
        });
    });

});

// Example Methods:

// Setup Methods
// initialize (BB method)
//  afterInitialize
// start
//  bindEvents
//  beforeRender
//  render
//  beforeRenderChildren
//  renderChildren
//  afterRenderChildren
//  afterRender
// stop
//  beforeRemove
//  remove (BB method)
