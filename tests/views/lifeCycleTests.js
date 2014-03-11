define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy', 'sinonStub'],
    function (_, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';
        var VIEW1_NAME = 'testView1',
            CHILD_VIEW_NAME = 'childView',
            should = chai.should();


        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');


        describe('BaseView Lifecycle Methods', function () {
            //-----------Setup-----------
            var BaseView,
                viewInstance,
                AsyncExtendedBaseView,
                AsyncBaseViewRejectedInBeforeRender,
                AsyncBaseViewRejectedInRender,
                AsyncBaseViewRejectedInAfterRender,
                SyncExtendedBaseView,
                asyncInstance,
                syncInstance,
                baseView,
                $beforeRenderDeferred,
                $afterRenderDeferred;


            beforeEach(function (done) {
                BaseView = masseuse.BaseView;
                AsyncExtendedBaseView = BaseView.extend({
                    beforeRender : function (deferred) {
                        $beforeRenderDeferred = deferred;
                    },
                    afterRender : function (deferred) {
                        $afterRenderDeferred = deferred;
                    }
                });
                AsyncBaseViewRejectedInBeforeRender = BaseView.extend({
                    beforeRender : function (deferred) {
                        deferred.reject();
                    }
                });
                AsyncBaseViewRejectedInRender = BaseView.extend({
                    render : function (deferred) {
                        deferred.reject();
                    }
                });
                AsyncBaseViewRejectedInAfterRender = BaseView.extend({
                    afterRender : function (deferred) {
                        deferred.reject();
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
                baseView = new BaseView();
                done();
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

                it('should return the same promise if called twice', function() {
                    viewInstance.start().should.equal(viewInstance.start());
                });

                it('should not run the life cycle methods if called twice', function() {
                    var events = [];
                    viewInstance.start();

                    viewInstance.on('all', function(event) {
                        events.push(event);
                    });

                    viewInstance.start();
                    events.length.should.equal(0);
                });

                it('should set the property hasStarted when startPromise is resolved', function(done) {
                    viewInstance.start()
                        .done(function() {
                            viewInstance.should.have.property('hasStarted');
                            done();
                        });
                });

                it('should set the hasStarted property to true when startPromise is resolved', function(done) {
                    viewInstance.start()
                        .done(function() {
                            viewInstance.hasStarted.should.equal(true);
                            done();
                        });
                });

                it('should set the property $startPromise when startPromise is resolved', function(done) {
                    viewInstance.start()
                        .done(function() {
                            viewInstance.should.have.property('$startPromise');
                            done();
                        });
                });

                describe('promise', function () {
                    // Using done as a spy. If it is not called, the test will fail.
                    it('should be resolved after start promise is resolved', function (done) {
                        viewInstance
                            .start()
                            .done(function() {
                                done();
                            });
                    });

                    it('should be resolved immediately after start is called if all implemented life cycle methods' +
                        'are synchronous', function () {
                        var $promise = viewInstance.start();
                        $promise.state().should.equal('resolved');

                    });

                    it('should be triggered with "beforeRenderDone", "renderDone", and "afterRenderDone" in sequence',
                        function () {
                            var eventSpy = sinon.spy();
                            viewInstance.on('all', eventSpy);
                            viewInstance.start();
                            eventSpy.firstCall.args[0].should.equal('beforeRenderDone');
                            eventSpy.secondCall.args[0].should.equal('afterTemplatingDone');
                            eventSpy.thirdCall.args[0].should.equal('renderDone');
                            eventSpy.getCall(3).args[0].should.equal('afterRenderDone');
                        });

                    it('view should have events "beforeRenderDone", "renderDone", and "afterRenderDone" in sequence',
                        function (done) {
                            var eventSpy = sinon.spy();
                            viewInstance.on('all', function(event) {
                                eventSpy(event);
                                if (4 <= eventSpy.callCount) {
                                    eventSpy.firstCall.args[0].should.equal('beforeRenderDone');
                                    eventSpy.secondCall.args[0].should.equal('afterTemplatingDone');
                                    eventSpy.thirdCall.args[0].should.equal('renderDone');
                                    eventSpy.getCall(3).args[0].should.equal('afterRenderDone');
                                    done();
                                }
                            });
                            viewInstance.start();
                        });

                    describe('when rejected', function () {

                        describe('in beforeRender', function () {
                            it('should not call render', function () {
                                var viewInstance = new AsyncBaseViewRejectedInBeforeRender({name : VIEW1_NAME}),
                                    renderSpy = sinon.spy(viewInstance, 'render');

                                viewInstance.start();
                                renderSpy.should.not.have.been.calledOnce;
                            });
                        });

                        describe('in render', function () {
                            it('should notify beforeRenderDone then not notify renderDone', function (done) {
                                var eventSpy = sinon.spy(),
                                    viewInstance = new AsyncBaseViewRejectedInRender({name : VIEW1_NAME});

                                viewInstance
                                    .start()
                                    .progress(eventSpy)
                                    .fail(function() {
                                        eventSpy.firstCall.args[0].should.equal('beforeRenderDone');
                                        should.not.exist(eventSpy.secondCall);
                                        done();
                                    });

                            });
                        });

                        describe('in afterRender', function () {
                            it('should trigger beforeRenderDone then then trigger renderDone then NOT trigger ' +
                                'afterRenderDone',
                                function (done) {
                                    var eventSpy = sinon.spy(),
                                        viewInstance = new AsyncBaseViewRejectedInAfterRender({name : VIEW1_NAME});

                                    viewInstance.on('all', eventSpy);
                                    viewInstance
                                        .start()
                                        .fail(function() {
                                            eventSpy.firstCall.args[0].should.equal('beforeRenderDone');
                                            eventSpy.secondCall.args[0].should.equal('afterTemplatingDone');
                                            eventSpy.thirdCall.args[0].should.equal('renderDone');
                                            should.not.exist(eventSpy.getCall(3));
                                            done();
                                        });
                                });
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

                    it('should call appendOrInsertView', function () {
                        var checkAppendOrInsertSpy = sinon.spy(viewInstance, 'appendOrInsertView');
                        viewInstance.render();
                        checkAppendOrInsertSpy.should.have.been.calledOnce;
                    });

                    it('should not call render on all children, if they have not been started', function () {
                        var childView = new SyncExtendedBaseView(),
                            childRenderSpy = sinon.spy(childView, 'render');

                        viewInstance.addChild(childView);

                        viewInstance.render();
                        childRenderSpy.should.not.have.been.called;
                    });

                    it('should call render on all children, if they have already started', function (done) {
                        var childView = new SyncExtendedBaseView(),
                            childRenderSpy = sinon.spy(childView, 'render');

                        viewInstance.addChild(childView);

                        childView.start().done(function () {
                            viewInstance.render();

                            childRenderSpy.should.have.been.calledOnce;

                            done();
                        });
                    });
                });

                describe('remove method', function() {

                    it('should remove any children', function(done) {
                        var childView = new BaseView();

                        childView.remove = sinon.spy(childView, 'remove');

                        viewInstance.addChild(childView);

                        childView.remove.should.not.have.been.called;

                        viewInstance.start().done(function () {
                            viewInstance.remove();
                            childView.remove.should.have.been.called;
                            done();
                        });
                    });

                    it('should fire an onRemove event', function(done) {
                        var callback = sinon.spy();

                        viewInstance.listenTo(viewInstance, 'onRemove', function() {
                            callback();
                        });

                        viewInstance.start().done(function() {
                            viewInstance.remove();
                            callback.should.have.been.called;
                            done();
                        });
                    });
                });

                it('should call start on any children', function (done) {
                    var childView = new BaseView();

                    childView.start = sinon.spy(childView, 'start');

                    viewInstance.addChild(childView);

                    childView.start.should.not.have.been.called;

                    viewInstance.start().done(function () {
                        childView.start.should.have.been.calledOnce;
                        done();
                    });
                });

                it('should call start on any children of its children', function (done) {
                    var childView = new BaseView(),
                        childSubView = new BaseView();

                    childView.start = sinon.spy(childView, 'start');
                    childSubView.start = sinon.spy(childSubView, 'start');

                    childView.addChild(childSubView);
                    viewInstance.addChild(childView);

                    childView.start.should.not.have.been.called;
                    childSubView.start.should.not.have.been.called;

                    viewInstance.start().done(function () {
                        childView.start.should.have.been.calledOnce;
                        childSubView.start.should.have.been.calledOnce;
                        done();
                    });
                });

                it('should not render until it\'s parent has rendered', function () {
                    var childView = new (BaseView.extend({
                            name : CHILD_VIEW_NAME,
                            render : function () {
                            }
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

            describe('refresh method', function() {
                it('should not return the same promise as the start method', function() {
                    viewInstance.start().should.not.equal(viewInstance.refresh());
                });

                it('should run the life cycle methods', function() {
                    var events = [];
                    viewInstance.start();

                    viewInstance.on('all', function(event) {
                        events.push(event);
                    });

                    events.length.should.equal(0);
                    viewInstance.refresh();
                    events.should.deep
                        .equal(['beforeRenderDone', 'afterTemplatingDone', 'renderDone', 'afterRenderDone']);
                });

                it('should have an alias of restart', function() {
                    viewInstance.restart.should.equal(viewInstance.refresh);
                });

                it('should delete hasStarted, if allready started, ' +
                    'from the view before calling start again', function(done) {

                    var startStub;

                    viewInstance.start()
                        .done(function() {
                            startStub = sinon.stub(viewInstance, 'start');
                            viewInstance.refresh();
                            viewInstance.should.not.have.property('hasStarted');
                            done();
                        });
                });

                it('should delete $startPromise, if already started, ' +
                    'from the view before calling start again', function(done) {

                    var startStub;

                    viewInstance.start()
                        .done(function() {
                            startStub = sinon.stub(viewInstance, 'start');
                            viewInstance.refresh();
                            viewInstance.should.not.have.property('$startPromise');
                            done();
                        });
                });
            });

            describe('lifecycle methods', function() {
                it('are fired in order for a synchronous method', function() {
                    var events = [];
                    baseView.on('all', function(event) {
                        events.push(event);
                    });
                    baseView.start();
                    events.should.deep
                        .equal(['beforeRenderDone', 'afterTemplatingDone', 'renderDone', 'afterRenderDone']);
                });
                it('are fired in order for a asynchronous method', function(done) {
                    var events = [];
                    asyncInstance.on('all', function(event) {
                        events.push(event);
                    });

                    asyncInstance.start().done(function() {
                        events.should.deep
                            .equal(['beforeRenderDone', 'afterTemplatingDone', 'renderDone', 'afterRenderDone']);
                        done();
                    });

                    $beforeRenderDeferred.resolve();
                    $afterRenderDeferred.resolve();
                });
            });

            describe('beforeRender method, if implemented', function () {
                describe('with zero arguments', function () {
                    it('will trigger the beforeRender event, then the render event, then afterRender event in that ' +
                        'order', function () {

                        var BeforeRender = sinon.spy(syncInstance, 'beforeRender'),
                            Render = sinon.spy(syncInstance, 'render'),
                            AfterRender = sinon.spy(syncInstance, 'afterRender');

                        syncInstance.start().done(function () {
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
                        startDeferred = asyncInstance.start();
                        _.defer(function () {
                            startDeferred.fail(done);
                            $beforeRenderDeferred.reject();
                        });
                    });
                    it('will not call the afterRender method if its deferred is rejected', function (done) {
                        var AfterRender = sinon.spy(asyncInstance, 'afterRender'),
                            startDeferred = asyncInstance.start();
                        _.defer(function () {
                            startDeferred.fail(done);
                            $beforeRenderDeferred.reject();
                            AfterRender.should.not.have.been.called;
                        });
                    });
                });
            });

            describe('afterRender method, if implemented', function () {
                describe('with zero arguments', function () {
                    it('will trigger the beforeRender event, then the render event, then afterRender event in that ' +
                        'order', function () {
                        var BeforeRender = sinon.spy(syncInstance, 'beforeRender'),
                            Render = sinon.spy(syncInstance, 'render'),
                            AfterRender = sinon.spy(syncInstance, 'afterRender');

                        syncInstance.start().done(function () {
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
                        _.defer(function () {
                            $beforeRenderDeferred.resolve();
                            $afterRenderDeferred.reject();
                        });
                    });
                    it('will not call the afterRender method if the beforeRender deferred is rejected', function (done) {
                        var AfterRender = sinon.spy(asyncInstance, 'afterRender');
                        asyncInstance.start().fail(function () {
                            AfterRender.should.not.have.been.called;
                            done();
                        });
                        _.defer(function () {
                            $beforeRenderDeferred.reject();
                        });
                    });
                });
            });
        });
    });
