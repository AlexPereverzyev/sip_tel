import KoaRouter from 'koa-router';

export function healthChek(ctx: KoaRouter.RouterContext): void {
  ctx.body = { status: 'OK' };
}

export async function configXml(ctx: KoaRouter.RouterContext): Promise<void> {
  const paylaod = <Record<string, string>>ctx.request.body;
  const ext = paylaod.variable_sip_to_user;

  console.debug('CONFIG XML:', JSON.stringify(paylaod, null, 2));

  if (paylaod.section === 'dialplan' && ext === '0000') {
    ctx.status = 200;
    ctx.type = 'text/xml';
    ctx.body = `
    <document type="freeswitch/xml">
      <section name="dialplan">
        <context name="default">
          <extension name="test">
            <condition field="destination_number" expression="^0000$">
              <action application="ring_ready" />
              <action application="answer" />
              <action application="sleep" data="1000" />
              <action application="playback" data="voicemail/vm-greeting.wav" />
              <action application="hangup" />
            </condition>
          </extension>
        </context>
      </section>
    </document>
    `;

    console.log('CONFIG XML generated for', ext);
    return;
  }

  ctx.status = 404;
}
