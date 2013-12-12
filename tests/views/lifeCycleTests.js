define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai'],
    function (_, chai, Squire, mocha, sinon, sinonChai) {

        'use strict';
        var VIEW1_NAME = 'testView1',
            CHILD_VIEW_NAME = 'childView',
            injector = new Squire(),
            should = chai.should();


        require(['underscore', 'sinonCall', 'sinonSpy']);
        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');



        describe('BaseView Lifecycle Methods', function () {
        //-----------Setup-----------
        var BaseView,
            viewInstance,
            AsyncExtendedBaseView,
            SyncExtendedBaseView,
            asyncInstance,
            syncInstance,
            $beforeRenderDeferred,
            $afterRenderDeferred;


        beforeEach(function (done) {
            injector.require(['masseuse'], function (masseuse) {

                    BaseView = masseuse.BaseView;
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
                    viewInstance = syncInstance = new SyncExtendedBaseView({
                        name : VIEW1_NAME
                    });

                    done();
                },
                function () {
                    console.log('BaseView error.');
                });
        });

            //-----------Tests-----------
            describe('start method', function () {
                it('should exist', function () {
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
                describe('promise', function () {
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
                                eventSpy.firstCall.args[0].should.equal('beforeRenderDone');
                                eventSpy.secondCall.args[0].should.equal('renderDone');
                                eventSpy.thirdCall.args[0].should.equal('afterRenderDone');
                                done();
                            }
                        });
                    });

                });
                describe('render method', function () {
                    it('should exist', function () {
                        should.exist(viewInstance.render);
                    });
                    it('should be a function', function () {
                        viewInstance.render.should.be.a('function');
                    });

                    it('should call checkForEl', function(){
                       var checkElSpy = sinon.spy(viewInstance, 'checkForEl');
                       viewInstance.render();
                       checkElSpy.should.have.been.calledOnce;
                    });

                    it('should call appendOrInsertView', function(){
                        var checkAppendOrInsertSpy = sinon.spy(viewInstance, 'appendOrInsertView');
                        viewInstance.render();
                        checkAppendOrInsertSpy.should.have.been.calledOnce;
                    });
                });

                describe('checkForEl method', function(){
                    it('should call set element if it doesn\'t have an el and its options do', function(){
                        var setElementSpy = sinon.spy(viewInstance, 'setElement');
                        viewInstance.el = undefined;
                        viewInstance.options.el = true;
                        viewInstance.render();
                        setElementSpy.should.have.been.calledOnce;
                    });

                    it('should not call set element if it doesn\'t have an el and options dont either', function(){
                        var setElementSpy = sinon.spy(viewInstance, 'setElement');
                        viewInstance.el = undefined;
                        viewInstance.options.el = undefined;
                        viewInstance.render();
                        setElementSpy.should.not.have.been.called;
                    });

                    it('should call set element if it has a parent and option el', function(){
                        var setElementSpy = sinon.spy(viewInstance, 'setElement');
                        viewInstance.parent = true;
                        viewInstance.options.el = true;
                        viewInstance.render();
                        setElementSpy.should.have.been.calledOnce;
                    });
                });

                it('should call start on any children', function () {
                    var childView = new (BaseView.extend({
                        name: CHILD_VIEW_NAME
                    }))();

                    childView.start = sinon.spy(childView, 'start');

                    viewInstance.addChild(childView);

                    childView.start.should.not.have.been.called;

                    viewInstance.start().done(function () {
                        childView.start.should.have.been.calledOnce;
                    });
                });

                it('should not render until it\'s parent has rendered', function () {
                    var childView = new (BaseView.extend({
                            name: CHILD_VIEW_NAME,
                            render: function () { }
                        }))(),
                        childRender = sinon.spy(childView, 'render');

                    viewInstance.addChild(childView);

                    childRender.should.not.have.been.called;

                    viewInstance.start()
                        .progress(function (progress) {
                            if (progress === BaseView.beforeRenderDone) {
                                childRender.should.not.have.been.called;
                            } else if (progress === BaseView.renderDone) {
                                _.defer(function () {
                                    //childRender.should.have.been.calledOnce;
                                });
                            }
                        });
                });
            });




            describe('beforeRender method, if implemented', function () {
                describe('with zero arguments', function () {
                    it('will trigger the beforeRender event, then the render event, then afterRender event in that order', function () {

                        var BeforeRender = sinon.spy(syncInstance, 'beforeRender'),
                            Render = sinon.spy(syncInstance, 'render'),
                            AfterRender = sinon.spy(syncInstance, 'afterRender');

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
                describe('with one argument', function () {
                    it('will fail the start method if its deferred is rejected', function (done) {
                        var startDeferred;
                        console.log($beforeRenderDeferred);
                        startDeferred = asyncInstance.start();
                        _.defer(function() {
                            startDeferred.fail(done);
                            $beforeRenderDeferred.reject();
                        });
                    });
                    it('will not call the afterRender method if its deferred is rejected', function (done) {
                        var AfterRender = sinon.spy(asyncInstance, 'afterRender'),
                            startDeferred = asyncInstance.start();
                        _.defer(function() {
                            startDeferred.fail(done);
                            $beforeRenderDeferred.reject();
                            AfterRender.should.not.have.been.called;
                        });
                    });
                });
            });

            describe('afterRender method, if implemented', function () {
                describe('with zero arguments', function () {
                    it('will trigger the beforeRender event, then the render event, then afterRender event in that order', function () {
                        var BeforeRender = sinon.spy(syncInstance, 'beforeRender'),
                            Render = sinon.spy(syncInstance, 'render'),
                            AfterRender = sinon.spy(syncInstance, 'afterRender');

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
                describe('with one argument', function () {
                    it('will fail the start method if its deferred is rejected', function (done) {
                        asyncInstance.start().fail(done);
                        _.defer(function() {
                            $beforeRenderDeferred.resolve();
                            $afterRenderDeferred.reject();
                        });
                    });
                    it('will not call the afterRender method if the beforeRender deferred is rejected', function (done) {
                        var AfterRender = sinon.spy(asyncInstance, 'afterRender');
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