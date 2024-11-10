import { Server } from 'http';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import * as api from './api';
import config from './config';
import EslServer from './events';

export default class App {
  private app: Koa | null = null;
  private server: Server | null = null;
  private events: EslServer | null = null;

  start(port = config.rest.port): void {
    if (this.server) {
      console.warn('REST server already started');
      return;
    }

    this.events = new EslServer();
    this.events.start();

    const router = new KoaRouter<IAppState, IAppContext>();
    router.get('/health', api.healthChek);
    router.get('/esl', api.statusEsl);
    router.post('/fs', api.configXml);

    this.app = new Koa();
    this.app.context.events = this.events;
    this.app.use(bodyParser());
    this.app.use(router.routes());
    this.app.on('error', (err: unknown) => {
      if (err instanceof Error) {
        Object.assign(err, { status: 503, expose: true });
        console.error('server error:', err.message);
      }
    });

    this.server = this.app.listen(port, () => {
      console.info('REST server started at port', port);
    });
  }

  stop(): void {
    if (this.events) {
      this.events.stop();
    }

    if (this.server) {
      this.server.close(() => {
        console.info('REST server stopped');
      });

      this.server.removeAllListeners();
      this.server = null;
      this.app = null;

      console.info('REST server stopping');
    }
  }
}
