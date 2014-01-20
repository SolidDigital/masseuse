define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse) {

        'use strict';
        var VIEW1_NAME = 'testView1',
            CHILD_VIEW_NAME = 'childView',
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
                // testing fail
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

            describe('render', function() {
                var testDom = 'testDom',
                //riveted = 'riveted',
                    $body = $('body'),
                    view;

                beforeEach(function() {
                    var $div = $('<div id="' + testDom + '"/>');
                    $body.append($div);
                });

                afterEach(function() {
                    view.remove();
                    $('#' + testDom).html('');
                });

                describe('not including an options.el', function() {


                    describe('or id, tag, class, or attrs', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                template : '<div id="me"></div>'
                            });
                        });
                        it('will create an empty wrapping div for view.el', function() {
                            outerHtml($(view.el)).should.equal('<div></div>');
                        });
                        it('will render the template into that div', function(done) {
                            view.start().done(function() {
                                view.$el.html().should.equal('<div id="me"></div>');
                                done();
                            });
                        });
                        describe('and adding an option.appendTo sizzle', function() {
                            beforeEach(function() {
                                view = new BaseView({
                                    appendTo : '#' + testDom,
                                    template : '<div id="me"></div>'
                                });
                            });
                            it('will append view.el to $(appendTo)', function(done) {
                                view.start().done(function() {
                                    $('#' + testDom).html().should.equal('<div><div id="me"></div></div>');
                                    done();
                                });
                            });
                            it('will append the template without view.el to $(appendTo) if options.wrapper === false',
                                function(done) {
                                    view = new BaseView({
                                        appendTo : '#' + testDom,
                                        wrapper : false,
                                        template : '<div id="me"></div>'
                                    });
                                    view.start().done(function() {
                                        $('#' + testDom).html().should.equal('<div id="me"></div>');
                                        done();
                                    });
                                });
                        });
                    });

                    describe('supplying a classname', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                className : 'test'
                            });
                        });
                        it('will create a div with the right classname', function() {
                            outerHtml($(view.el)).should.equal('<div class="test"></div>');
                        });
                    });
                    describe('supplying a tagname', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                tagName : 'ul'
                            });
                        });
                        it('will create a div with the right tagname', function() {
                            outerHtml($(view.el)).should.equal('<ul></ul>');
                        });
                    });
                    describe('supplying a id', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                id : 'test'
                            });
                        });
                        it('will create a div with the right id', function() {
                            outerHtml($(view.el)).should.equal('<div id="test"></div>');
                        });
                    });
                    describe('supplying a attributes', function() {
                        beforeEach(function() {
                            view = new BaseView({
                                attributes : { href : 'http://blah.ha' }
                            });
                        });
                        it('will create a div with the right attribute', function() {
                            outerHtml($(view.el)).should.equal('<div href="http://blah.ha"></div>');
                        });
                    });

                });

            });
        });

        function outerHtml(ellie) {
            return $('<div>').append($(ellie).clone()).html();
        }
    });
