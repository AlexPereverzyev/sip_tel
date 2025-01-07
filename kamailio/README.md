## Kamailio 5.7.x Docker Image

```
docker build -t kamailio:local .

docker run --name kamailio \
--network host \
-v $(pwd)/etc:/etc/kamailio \
-d kamailio:local
```

After container has started, you can:

```
docker exec -it kamailio sngrep
docker exec -it kamailio kamcmd ul.dump
docker stop kamailio && docker rm kamailio
```

_Note: to get default config, run image w/o config voulme, then copy config to local directory:_

```
docker cp kamailio:/etc/kamailio etc_default
```

### Kamailio Database

Make sure PostgreSQL container is started:

```
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17
```

Create core Kamailio schema:

```
docker run -it --rm \
--network host \
--entrypoint=bash \
-v $(pwd)/etc:/etc/kamailio \
kamailio:local

export PGPASSWORD=postgres
kamdbctl create
```

_Note, additional features schema (eg: presense) is not required._

Then to create extension to PBX SIP endpoint mappings run:

```
docker exec -it postgres psql -U postgres -d kamailio

CREATE TABLE usr_pbx (
    usr TEXT PRIMARY KEY,
    sip_ep TEXT NULL
);

INSERT INTO usr_pbx (usr, sip_ep) VALUES ('freeswitch', 'skip');
INSERT INTO usr_pbx (usr, sip_ep) VALUES ('1000', 'sip:freeswitch@192.168.0.000:5060');
INSERT INTO usr_pbx (usr, sip_ep) VALUES ('1001', 'sip:freeswitch@192.168.0.000:5060');
INSERT INTO usr_pbx (usr, sip_ep) VALUES ('1002', 'sip:freeswitch@192.168.0.000:5060');
```

_Note, setting `skip` for particular extension makes it freely routale w/o FreeSWITCH._

_Note, update `192.168.0.000` placeholder to the actual FreeSWITCH IP._

_Note, in case FreeSWITCH is registering over TLS SIP profile with port 5061, the `sip_ep` should be updated accordingly._

## TLS Setup

-   generate certificates: `./certs.sh`
-   set `#!define WITH_TLS` in config template
-   for FreeSWITCH, follow `README.md` instructions in FreeSWITCH directory

### TLS for Linphone

-   make `linphone` directory in home
-   copy `cacert.pem` from kamailio directory to `linphone` directory
-   copy `ext1002cert.pem` and `ext1002key.pem` to `linphone` directory
-   update linphone config: `nano ~/.config/linphone/linphonerc`:

```
[sip]
root_ca=~/linphone/cacert.pem
client_cert_chain=~/linphone/ext1002cert.pem
client_cert_key=~/linphone/ext1002key.pem
verify_server_certs=1
verify_server_cn=1
```

_Note: dont forget to replace ~_

#### Alternatively (not tested)

```
sudo cp ~/linphone/cacert.pem /usr/local/share/ca-certificates/cacert.crt
sudo update-ca-certificates
```

## Datadog Metrics

```
docker run --name dd-agent \
--network host \
-e DD_API_KEY=secret \
-e DD_HOSTNAME=kamailio-test \
-e DD_TAGS='env:local servicename:kamailio' \
-e DD_LOGS_ENABLED=false \
-e DD_APM_ENABLED=false \
-e DD_PROCESS_AGENT_ENABLED=false \
-d gcr.io/datadoghq/agent:7

docker stop dd-agent && docker rm dd-agent
```

- https://www.kamailio.org/docs/modules/5.7.x/modules/timer.html
- https://www.kamailio.org/docs/modules/5.7.x/modules/rtimer.html
- https://www.kamailio.org/docs/modules/5.7.x/modules/jsonrpcs.html#jsonrpcs.f.jsonrpc_exec
- https://kamailio.org/wikidocs/tutorials/troubleshooting/memory/
- https://www.kamailio.org/docs/modules/5.7.x/modules/kex.html
- https://www.kamailio.org/docs/modules/5.7.x/modules/corex.html
- https://www.kamailio.org/docs/modules/5.7.x/modules/dlgs.html
- https://www.kamailio.org/docs/modules/5.7.x/modules/tls.html#tls.r.tls.list
- https://www.kamailio.org/docs/modules/5.7.x/modules/slack.html

## Manual Kamalio Installation

https://kamailio.org/docs/tutorials/devel/kamailio-install-guide-deb/

Go to https://deb.kamailio.org/ and add repo keys:

```
wget -O- http://deb.kamailio.org/kamailiodebkey.gpg | sudo apt-key add -
```

Open `/etc/apt/sources.list` and add:

```
deb http://deb.kamailio.org/kamailio57 jammy main
deb-src http://deb.kamailio.org/kamailio57 jammy main
```

## Read Order

- https://www.kamailio.org/wikidocs/
- https://www.kamailio.org/wikidocs/cookbooks/5.7.x/core
- https://www.kamailio.org/wikidocs/cookbooks/5.7.x/pseudovariables/
- https://www.kamailio.org/wikidocs/cookbooks/5.7.x/transformations/
- https://kamailio.org/docs/modules/5.7.x/
- https://kamailio.org/docs/modules/5.7.x/modules/usrloc.html
- https://kamailio.org/docs/modules/5.7.x/modules/registrar.html
- https://kamailio.org/docs/modules/5.7.x/modules/db_postgres.html
- https://kamailio.org/docs/modules/5.7.x/modules/sqlops.html
- https://kamailio.org/docs/modules/5.7.x/modules/nathelper.html
- https://nickvsnetworking.com/kamailio-introduction/
- https://nickvsnetworking.com/kamailio-use-case-sip-honeypot-with-sql-database/
- https://wazo-platform.org/blog/kamailio-routing-with-rtjson-and-http-async-client
- https://kamailio.org/docs/modules/5.7.x/modules/http_async_client.html
- https://kamailio.org/docs/modules/5.7.x/modules/rtjson.html
- https://kamailio.org/docs/modules/5.7.x/modules/tls.html
