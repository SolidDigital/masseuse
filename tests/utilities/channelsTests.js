define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', '../../app/utilities/channels', 'sinonSpy'],
    function (_, chai, mocha, sinon, sinonChai, Channels) {

        'use strict';

        chai.should();

        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('Channels', function() {

            it('channels itself can be used as an event bus', function() {
                var channels = new Channels(),
                    spy1 = sinon.spy();

                channels.on('test', spy1);

                channels.trigger('test');

                spy1.should.have.been.calledOnce;
            });

            it('channels can be instantiated with a namespace string', function() {
                var channels = new Channels('test1'),
                    spy1 = sinon.spy();

                channels.test1.on('test', spy1);

                channels.test1.trigger('test');

                spy1.should.have.been.calledOnce;
            });

            it('can be used without requiring the "new" keyword', function () {
                var channels = Channels(),
                    spy = sinon.spy();

                channels.on('test', spy);

                channels.trigger('test');

                spy.should.have.been.calledOnce;
            });

            it('channels can be instantiated with a namespace array', function() {
                var channels = new Channels(['test1', 'test2']),
                    spy1 = sinon.spy(),
                    spy2 = sinon.spy();

                channels.test1.on('test', spy1);
                channels.test2.on('test', spy2);

                channels.test1.trigger('test');
                channels.test2.trigger('test');

                spy1.should.have.been.calledOnce;
                spy2.should.have.been.calledOnce;
            });

            it('all objects in nested channels have events', function() {
                var channels = new Channels(),
                    spy1 = sinon.spy(),
                    spy2 = sinon.spy(),
                    spy3 = sinon.spy(),
                    spy4 = sinon.spy();

                channels.addChannel('test1.test2.test3');
                channels.on('test', spy1);
                channels.test1.on('test', spy2);
                channels.test1.test2.on('test', spy3);
                channels.test1.test2.test3.on('test', spy4);

                channels.trigger('test');
                channels.test1.trigger('test');
                channels.test1.test2.trigger('test');
                channels.test1.test2.test3.trigger('test');

                spy1.should.have.been.calledOnce;
                spy2.should.have.been.calledOnce;
                spy3.should.have.been.calledOnce;
                spy4.should.have.been.calledOnce;
            });
        });
    });
