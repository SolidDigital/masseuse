define(['jquery', 'underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'masseuse', 'rivetsPlugin', 'sinonSpy'],
    function ($, _, chai, mocha, sinon, sinonChai, masseuse, rivetsPlugin) {

        'use strict';

        var testDom = 'testDom',
            riveted = 'riveted',
            $body = $('body'),
            BaseView = masseuse.BaseView,
            template = '<div id="' + riveted + '">{{data.title}}</div>',
            RivetView;

        chai.use(sinonChai);
        mocha.setup('bdd');


        describe('view riveting', function () {
            beforeEach(function() {
                var $div = $('<div id="' + testDom + '"/>');
                $body.append($div);

                RivetView = BaseView.extend({
                    initialize: initialize,
                    start: start
                });
            });

            afterEach(function() {
                $('#' + testDom).remove();
            });

            it('test dom is present', function() {
                $('#' + testDom).length.should.equal(1);
            });

            it('test dom is riveted', function(done) {
                var options = {
                    el : '#' + testDom,
                    viewOptions : ['rivetConfig'],
                    rivetConfig : 'auto',
                    templateHtml : template,
                    modelData : {
                        title : 'There it is.'
                    }
                };

                new RivetView(options).start().done(function() {
                    $('#' + riveted).html().should.equal('There it is.');
                    done();
                });
            });
        });

        function initialize (options) {
            options.plugins = [];
            options.plugins.push(rivetsPlugin.plugin);
            this.options = options;
            BaseView.prototype.initialize.call(this, options);
        }

        function start () {
            var $promise = BaseView.prototype.start.apply(this, arguments),
                self = this;
            $promise.progress(function (event) {
                switch (event) {
                case BaseView.afterRenderDone:
                    if (self.rivetConfig) {
                        self.rivetView();
                    }
                    break;
                }
            });

            return $promise;
        }

    });
