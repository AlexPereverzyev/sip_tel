FROM debian:bullseye-slim

ARG TOKEN

RUN apt-get update && \
    apt-get install -y gnupg2 curl nano sngrep ngrep && \
    curl -u signalwire:$TOKEN -o /usr/share/keyrings/signalwire-freeswitch-repo.gpg https://freeswitch.signalwire.com/repo/deb/debian-release/signalwire-freeswitch-repo.gpg && \
    echo "machine freeswitch.signalwire.com login signalwire password $TOKEN" > /etc/apt/auth.conf && \
    echo "deb [signed-by=/usr/share/keyrings/signalwire-freeswitch-repo.gpg] https://freeswitch.signalwire.com/repo/deb/debian-release/ bullseye main" > /etc/apt/sources.list.d/freeswitch.list && \
    apt-get update && \
    apt-get dist-upgrade -y && \
    apt-get install -y --no-install-recommends \
    freeswitch \
    freeswitch-mod-abstraction \ 
    freeswitch-mod-commands \
    freeswitch-mod-console \
    freeswitch-mod-sofia \
    freeswitch-mod-shout \
    freeswitch-mod-event-socket \
    freeswitch-mod-curl \
    freeswitch-mod-dialplan-xml \
    freeswitch-mod-sndfile \
    freeswitch-mod-native-file \
    freeswitch-mod-tone-stream \
    freeswitch-mod-dptools \
    freeswitch-mod-hash \
    freeswitch-mod-pgsql \
    freeswitch-meta-codecs \
    freeswitch-meta-conf \
    freeswitch-meta-lang \
    freeswitch-lang-en \
    freeswitch-sounds-en-us-allison && \
    apt-get clean autoclean && \
    apt-get autoremove --yes

COPY entrypoint.sh /
RUN chmod 755 entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
