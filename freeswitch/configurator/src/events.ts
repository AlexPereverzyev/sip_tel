import esl from 'modesl';
import config from './config';

export enum EslEvents {
  Bridge = 'CHANNEL_BRIDGE',
  HangupComplete = 'CHANNEL_HANGUP_COMPLETE',
  ExecuteComplete = 'CHANNEL_EXECUTE_COMPLETE',
}

export default class EslServer implements IEventsServer {
  private server: esl.Server | null = null;

  start(port = config.esl.server.port): void {
    if (this.server) {
      console.warn('ESL server already started');
      return;
    }

    this.server = new esl.Server({ port, myevents: true }, () => {
      console.info('ESL server started at port', port);
    });

    this.server.on('connection::open', (conn: esl.Connection, id: string) => {
      console.log(id, 'ESL connection opened');

      conn.on('connection::close', (conn: esl.Connection, id: string) => {
        console.log(id, 'ESL connection closed');
      });

      conn.on('error', (err: Error) => {
        console.error(id, 'ESL connection failed:', err.message);
        this.connClose(conn, id);
      });

      conn.events('json', 'all');
      conn.sendRecv('linger', '');

      console.log(id, 'ESL connection configured');
    });

    this.server.on('connection::ready', async (conn: esl.Connection, id: string) => {
      await this.executeDialplan(conn, id);
      this.connClose(conn, id);
    });
  }

  stop(): void {
    if (!this.server) {
      return;
    }

    this.server.close(() => {
      console.info('ESL server stopped');
    });

    this.server.removeAllListeners();
    this.server = null;

    console.info('ESL server stopping');
  }

  getStatus(): Promise<string> {
    return this.withInboundConn(
      async (c: esl.Connection) =>
        new Promise<string>((resolve, reject) =>
          c.api('status', [], (res?: esl.Event) => (res ? resolve(res.getBody()) : reject()))
        )
    );
  }

  private async executeDialplan(conn: esl.Connection, id: string): Promise<void> {
    console.log(id, 'ESL connection executing call');

    await this.outboundConnExecute(conn, 'sleep', '1000');
    await this.outboundConnExecute(conn, 'playback', 'voicemail/vm-greeting.wav');
    await this.outboundConnExecute(conn, 'sleep', '1000');
    await this.outboundConnExecute(conn, 'hangup');

    console.log(id, 'ESL connection executed');
  }

  private async withInboundConn<T>(
    routine: (conn: esl.Connection) => Promise<T>,
    id = Math.random().toString().substring(2, 8)
  ) {
    let conn;
    try {
      conn = await new Promise<esl.Connection>((resolve, reject) => {
        const c = new esl.Connection(
          config.esl.freeswitch.host,
          config.esl.freeswitch.port,
          config.esl.freeswitch.password
        )
          .once('error', (err: unknown) => {
            if (err instanceof Error) {
              console.error(id, 'ESL connection error', err.message);
            }
            reject(err);
          })
          .once('esl::ready', () => {
            console.debug(id, 'ESL connection opened');
            resolve(c);
          });
      });

      return await routine(conn);
    } finally {
      if (conn) {
        this.connClose(conn, id);
      }
    }
  }

  private outboundConnExecute(conn: esl.Connection, app: string, data?: string): Promise<void> {
    conn.execute(app, data);

    return new Promise<void>((resolve) => {
      const completeListener = (event: esl.Event) => {
        if (
          event.getHeader('variable_current_application') === app ||
          (event.getHeader('Event-Name') === EslEvents.HangupComplete && app === 'hangup')
        ) {
          conn.off(this.toSubscription(EslEvents.ExecuteComplete), completeListener);
          conn.off(this.toSubscription(EslEvents.HangupComplete), completeListener);
          resolve();
        }
      };
      conn.on(this.toSubscription(EslEvents.ExecuteComplete), completeListener);
      conn.on(this.toSubscription(EslEvents.HangupComplete), completeListener);
    });
  }

  private connClose(conn: esl.Connection, id: string) {
    conn.disconnect();
    conn.removeAllListeners();

    console.log(id, 'ESL connection closed');
  }

  private toSubscription(event: EslEvents) {
    return `esl::event::${event}::*`;
  }
}
