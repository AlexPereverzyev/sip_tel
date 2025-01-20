## RTPEngine 10.5.x.x Docker Image

```
docker build -t rtpengine:local .

docker run --name rtpengine \
--network host \
-v $(pwd)/etc:/etc/rtpengine \
-d rtpengine:local

docker stop rtpengine && docker rm rtpengine
```

Or explore the image:

```
docker run -it --rm \
--network host \
--entrypoint=bash \
rtpengine:local
```

Alternatively RTPEngine can be built from source:

```
docker build --build-arg TAG_NAME=mr12.5.1.21 -t rtpengine:local -f Dockerfile.build .
```

_Note: to get default config, run image w/o config volume, then copy config to local directory:_

```
docker cp rtpengine:/etc/rtpengine etc_default
```

After container has started, you can:

```
docker exec -it rtpengine bash

rtpengine-ctl list sessions all
```

## Read Order

- https://rtpengine.readthedocs.io/en/latest/overview.html
- https://rtpengine.readthedocs.io/en/latest/usage.html
- https://rtpengine.readthedocs.io/en/latest/rtpengine.html
- https://www.kamailio.org/docs/modules/5.4.x/modules/rtpengine.html
- https://nickvsnetworking.com/kamailio-bytes-rtp-media-proxying-with-rtpengine/
