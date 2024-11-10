import KoaRouter from 'koa-router';
import config from './config';

const CURL_ESL_EXT = '8888';

export function healthChek(ctx: KoaRouter.RouterContext<IAppState, IAppContext>): void {
  ctx.body = { status: 'OK' };
}

export async function statusEsl(ctx: KoaRouter.RouterContext<IAppState, IAppContext>): Promise<void> {
  const status = await ctx.events.getStatus();
  ctx.body = { status };
}

export async function configXml(ctx: KoaRouter.RouterContext<IAppState, IAppContext>): Promise<void> {
  const paylaod = <Record<string, string>>ctx.request.body;
  const ext = paylaod.variable_sip_to_user;

  // console.debug('CONFIG XML:', JSON.stringify(paylaod, null, 2));

  if (paylaod.section === 'dialplan' && ext === CURL_ESL_EXT) {
    ctx.status = 200;
    ctx.type = 'text/xml';
    ctx.body = `
    <document type="freeswitch/xml">
      <section name="dialplan">
        <context name="default">
          <extension name="test">
            <condition field="destination_number" expression="^${CURL_ESL_EXT}$">
              <action application="ring_ready" />
              <action application="answer" />
              <action application="socket" data="${config.esl.server.host}:${config.esl.server.port} async full"/>
            </condition>
          </extension>
        </context>
      </section>
    </document>
    `;

    console.log('CONFIG XML generated -', ext);
    return;
  }

  ctx.status = 404;
}
