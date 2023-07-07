FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install -y gnupg2 curl nano sngrep dnsutils && \
    curl -k https://deb.kamailio.org/kamailiodebkey.gpg | apt-key add - && \
    echo "deb http://deb.kamailio.org/kamailio57 bullseye main" > /etc/apt/sources.list.d/kamailio.list && \
    apt-get update && \
    apt-get dist-upgrade -y && \
    apt-get install -y --no-install-recommends \
    kamailio \
    kamailio-postgres-modules \
    kamailio-json-modules \
    kamailio-extra-modules \
    kamailio-outbound-modules \
    kamailio-tls-modules && \
    apt-get clean autoclean && \
    apt-get autoremove --yes

COPY entrypoint.sh /
RUN chmod 755 entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

