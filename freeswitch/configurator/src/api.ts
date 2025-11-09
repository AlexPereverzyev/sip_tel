import KoaRouter from 'koa-router';
import config from './config';

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

  if (paylaod.section === 'dialplan' && ext === '8888') {
    ctx.status = 200;
    ctx.type = 'text/xml';
    ctx.body = `
    <document type="freeswitch/xml">
      <section name="dialplan">
        <context name="default">
          <extension name="test">
            <condition field="destination_number" expression="^8888$">
              <action application="ring_ready" />
              <action application="answer" />
              <action application="socket" data="${config.esl.server.host}:${config.esl.server.port} async full"/>
            </condition>
          </extension>
        </context>
      </section>
    </document>
    `;
    return;
  }

  if (paylaod.section === 'configuration' && paylaod.key_value === 'callcenter.conf') {
    console.debug('CONFIG REQUEST:', JSON.stringify(paylaod, null, 2));

    /* eslint-disable max-len */

    ctx.status = 200;
    ctx.type = 'text/xml';
    ctx.body = `
      <document type="freeswitch/xml">
      <section name="configuration">
      <configuration name="callcenter.conf">
        <settings>
          <param name="odbc-dsn" value="$\${dsn}"/>
        </settings>
        <queues>
          <queue name="test_queue1">
            <param name="strategy" value="agent-with-least-talk-time"/>
            <param name="moh-sound" value="$\${hold_music}"/>
            <param name="time-base-score" value="queue"/>
            <param name="tier-rules-apply" value="false"/>
            <param name="tier-rule-wait-second" value="300"/>
            <param name="tier-rule-wait-multiply-level" value="true"/>
            <param name="tier-rule-no-agent-no-wait" value="false"/>
            <param name="discard-abandoned-after" value="14400"/>
            <param name="max-wait-time" value="0"/>
            <param name="max-wait-time-with-no-agent" value="120"/>
          </queue>
        </queues>
        <agents>
          <agent name="1000" type="callback" contact="[leg_timeout=10]user/1000" status="Available" state="Waiting" max-no-answer="3" wrap-up-time="10" reject-delay-time="10" busy-delay-time="60" />
        </agents>
        <tiers>
          <tier agent="1000" queue="test_queue1" level="1" position="1"/>
        </tiers>
      </configuration>
      </section>
      </document>
      `;

    console.debug('CONFIG RESPONSE:', ctx.body);
    return;
  }

  ctx.status = 404;
}
