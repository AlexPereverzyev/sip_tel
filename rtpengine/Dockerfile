FROM debian:bookworm-slim

RUN apt-get update && \
  apt-get install -y --no-install-recommends curl rtpengine && \
  apt-get clean autoclean && \
  apt-get autoremove --yes

COPY entrypoint.sh /
RUN chmod 755 entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

