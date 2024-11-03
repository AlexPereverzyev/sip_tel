import { Server } from 'http';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import * as api from './api';
import config from './config';

export default class App {
  private app: Koa | null;
  private server: Server | null;

  constructor() {
    this.app = null;
    this.server = null;
  }

  start(port = config.restPort): void {
    if (this.server) {
      console.warn('server already started');
      return;
    }

    const router = new KoaRouter();
    router.get('/health', api.healthChek);
    router.post('/fs', api.configXml);

    this.app = new Koa();
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
    if (!this.server) {
      return;
    }
    this.server.close();
    this.server.removeAllListeners();
    this.server = null;
    this.app = null;

    console.info('REST server stopping');
  }
}
