define(['underscore', 'chai', 'squire', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function (_, chai, Squire, mocha, sinon, sinonChai, masseuse) {

        'use strict';
        var VIEW1_NAME = 'testView1',
            CHILD_VIEW_NAME = 'childView',
            injector = new Squire(),
            should = chai.should();


        chai.use(sinonChai);
        mocha.setup('bdd');


        describe('An instance of the BaseView', function () {


            //-----------Setup-----------
            var BaseView,
                viewInstance;

            beforeEach(function () {
                BaseView = masseuse.BaseView;
                viewInstance = new BaseView({
                    name : VIEW1_NAME
                });
            });


            //-----------Tests-----------
            it('should exist', function () {
                should.exist(BaseView);
            });

            describe('remove method', function () {
                // method should wrap View.remove
                it('should call stop on all children', function () {
                    var childView = new (BaseView.extend({
                            name : CHILD_VIEW_NAME
                        }))(),
                        childRemove = sinon.spy(childView, 'remove');

                    viewInstance.addChild(childView);

                    childRemove.should.not.have.been.called;

                    viewInstance.remove();

                    childRemove.should.have.been.calledOnce;
                });
            });

            describe('children', function () {
                describe('addChild method', function () {
                    it('should be a method', function () {
                        viewInstance.addChild.should.be.a('function');
                    });

                    it('should add a child view', function () {
                        var childView = new BaseView({
                            name : CHILD_VIEW_NAME
                        });

                        viewInstance.children.length.should.equal(0);

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);
                    });

                    it('should not add the same child view twice', function () {
                        var childView = new BaseView({
                            name : CHILD_VIEW_NAME
                        });

                        viewInstance.children.length.should.equal(0);

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);
                    });
                });

                describe('removeChild method', function () {
                    it('should remove a child view, if it exists', function () {
                        var childView = new BaseView({
                            name : CHILD_VIEW_NAME
                        });

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);

                        viewInstance.removeChild(childView);

                        viewInstance.children.length.should.equal(0);
                    });

                    it('should not remove any child views if a matching view is not found', function () {
                        var childView = new BaseView({
                                name : CHILD_VIEW_NAME
                            }),
                            anotherChildView = new BaseView({
                                name : 'Another Child'
                            });

                        viewInstance.addChild(childView);

                        viewInstance.children.length.should.equal(1);

                        viewInstance.removeChild(anotherChildView);

                        viewInstance.children.length.should.equal(1);
                    });
                });

                describe('removeAllChildren method', function () {
                    it('should remove all views from children', function () {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView();

                        viewInstance.addChild(childView1);
                        viewInstance.addChild(childView2);

                        viewInstance.children.length.should.equal(2);

                        viewInstance.removeAllChildren();

                        viewInstance.children.length.should.equal(0);
                    });

                    it('should remove nested children', function () {
                        var childView1 = new BaseView(),
                            childSubView1 = new BaseView(),
                            childSubView2 = new BaseView();

                        childSubView1.addChild(childSubView2);
                        childView1.addChild(childSubView1);
                        viewInstance.addChild(childView1);

                        viewInstance.children.length.should.equal(1);
                        childView1.children.length.should.equal(1);
                        childSubView1.children.length.should.equal(1);

                        viewInstance.removeAllChildren();

                        viewInstance.children.length.should.equal(0);
                        childView1.children.length.should.equal(0);
                        childSubView1.children.length.should.equal(0);
                    });
                });

                describe('refreshChildren method', function () {
                    it('should start children that have not been started', function(done) {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView(),
                            childStartView1 = sinon.spy(childView1, 'start'),
                            childStartView2 = sinon.spy(childView2, 'start');

                        viewInstance.addChild(childView1);
                        viewInstance.start()
                            .done(function () {
                                viewInstance.addChild(childView2);
                                childStartView1.should.have.been.calledOnce;
                                childStartView2.should.not.have.been.called;
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        childStartView1.should.have.been.calledTwice;
                                        childStartView2.should.have.been.calledOnce;
                                        done();
                                    });
                            });
                    });

                    it('should remove all the children and then call start on them', function (done) {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView(),
                            childStartView1 = sinon.spy(childView1, 'start'),
                            childStartView2 = sinon.spy(childView2, 'start');

                        viewInstance.addChild(childView1);
                        viewInstance.addChild(childView2);

                        viewInstance.start()
                            .done(function () {
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        childStartView1.should.have.been.calledTwice;
                                        childStartView2.should.have.been.calledTwice;
                                        done();
                                    });
                            });
                    });

                    it('should not remove the children from the parents children array.', function (done) {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView(),
                            viewInstanceRemoveChild = sinon.spy(viewInstance, 'removeChild'),
                            viewInstanceRemoveAllChildren = sinon.spy(viewInstance, 'removeAllChildren');

                        viewInstance.addChild(childView1);
                        viewInstance.addChild(childView2);

                        viewInstance.children.length.should.equal(2);
                        viewInstanceRemoveChild.should.not.have.been.called;
                        viewInstanceRemoveAllChildren.should.not.have.been.called;

                        viewInstance.start()
                            .done(function () {
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        viewInstance.children.length.should.equal(2);
                                        viewInstanceRemoveChild.should.not.have.been.called;
                                        viewInstanceRemoveAllChildren.should.not.have.been.called;
                                        done();
                                    });
                            });
                    });

                    it('should not remove the children of nested children.', function (done) {
                        var childView1 = new BaseView(),
                            childSubView1 = new BaseView();

                        childView1.addChild(childSubView1);
                        viewInstance.addChild(childView1);

                        viewInstance.children.length.should.equal(1);
                        childView1.children.length.should.equal(1);

                        viewInstance.start()
                            .done(function () {
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        viewInstance.children.length.should.equal(1);
                                        childView1.children.length.should.equal(1);
                                        done();
                                    });
                            });
                    });

                    it('should refresh nested children.', function (done) {
                        var childView1 = new BaseView(),
                            childView2 = new BaseView(),
                            childViewSub1 = new BaseView();

                        childViewSub1.start = sinon.spy(childViewSub1, 'start');

                        childView1.addChild(childViewSub1);
                        viewInstance.addChild(childView1);
                        viewInstance.addChild(childView2);

                        childViewSub1.start.should.not.have.been.called;

                        viewInstance.start()
                            .done(function () {
                                childViewSub1.start.should.have.been.calledOnce;
                                viewInstance.refreshChildren()
                                    .done(function() {
                                        childViewSub1.start.should.have.been.calledTwice;
                                        done();
                                    });
                            });
                    });
                });
            });

            describe('appendTo', function() {});
        });

        describe('An instance of extending the BaseView', function () {

            //-----------Setup-----------
            var BaseView,
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
                        syncInstance = new SyncExtendedBaseView({
                            name : VIEW1_NAME
                        });

                        done();
                    },
                    function () {});
            });
        });

    });
