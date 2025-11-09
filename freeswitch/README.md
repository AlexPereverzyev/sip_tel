## FreeSWITCH 1.10.x Docker Image

### SignalWire Access Token

Create SignalWire access token:
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Installation/HOWTO-Create-a-SignalWire-Personal-Access-Token_67240087/

### FreeSWITCH Source

Clone FreeSWITCH repo:
https://github.com/signalwire/freeswitch/tree/v1.10.12

Later the `scripts` directory will be mounted to the corresponding container.

### FreeSWITCH Image

```
docker build \
--build-arg TOKEN=$(cat signalwire.token) \
-t freeswitch:local .

docker run --name freeswitch \
--network host \
--cap-add SYS_NICE \
-v $(pwd)/etc:/etc/freeswitch \
-v $(pwd)/../../freeswitch/scripts/perl:/scripts \
-d freeswitch:local
```

_Note: make sure database container is running before starting FreeSWITCH._

After container has started, you can:

```
docker exec -it freeswitch fs_cli -p 12345
docker exec -it freeswitch sngrep
docker stop freeswitch && docker rm freeswitch
```

_Note: to get default config, run image w/o config voulme, then copy config to local directory._

```
docker cp freeswitch:/etc/freeswitch etc_default
```

## FreeSWITCH Database

The image relies on local PostgreSQL database instance:

```
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17
docker exec -it postgres psql -U postgres -c 'CREATE DATABASE freeswitch OWNER postgres;'
docker exec -it postgres psql -U postgres -d freeswitch -c 'CREATE SCHEMA fs AUTHORIZATION postgres;'

```

After PostgreSQL container has started, you can:

```
docker exec -it postgres psql -U postgres -d freeswitch

pg_dump -U postgres -h localhost -p 5432 -F c -b -v -t fs.voicemail_msgs -t public.* -f ./fs_db.dump freeswitch
pg_restore --clean --if-exists -U postgres -h localhost -p 5432 -d freeswitch -v ./fs_db.dump
```

_Note: this should be started before FreeSWITCH container._

To switch back to SQLite (_/var/lib/freeswitch/db_), comment-out:

- `core-db-dsn` parameter in `switch.conf.xml`
- `odbc-dsn` parameter in `internal.xml` SIP profile

## TLS Setup

After executing `./certs.sh` in `kamailio` directory:

- append `freeswitch` certificate to private key file, copy it to `etc/tls` directory and rename it to `agent.pem`
- copy `cacert.pem` to `etc/tls` directory and rename it to `cafile.pem`
- set `register-transport` to `tls` in `internal.xml` kamailio gateway
- set `kamailio` gateway transprot to `tls` in `internal.xml`

_Note: optionally, Linphone can be configured to use secure media (Calls and Chat preferences), at the same time secure media can be forced in FreeSWITCH dialplan._

## Misc

### Supported Extensions

- 9999: XML dialplan test
- 8888: cURL/ESL dialplan test (requires running `configurator` app)
- 7777: voicemail box
- 6xxx: fifo call queues
- 555x: call center queues
- 100[0-2]: directory users (extensions)

### Status and Reload Commands

From `fs_cli` run one of the following:

```
sofia status
sofia status profile internal

reloadxml
reloadacl
reload mod_sofia
sofia profile internal rescan
sofia profile internal restart
```

### Call Center Commands

Queues:

```
callcenter_config queue list
callcenter_config queue load test_queue1
callcenter_config queue unload test_queue1
callcenter_config queue reload test_queue1
```

_Note: queues are configured in XML file only, but can be delivered via Web hook._

Agents:

```
callcenter_config agent list
callcenter_config agent del 1000
callcenter_config agent add 1000 callback
callcenter_config agent set contact 1000 '[leg_timeout=10]user/1000'
callcenter_config agent set status 1000 Available
callcenter_config agent set state 1000 Waiting
callcenter_config agent set max_no_answer 1000 3
callcenter_config agent set wrap_up_time 1000 10
callcenter_config agent set reject_delay_time 1000 10
callcenter_config agent set busy_delay_time 1000 60
```

Agent to Queues Mapping:

```
callcenter_config tier list
callcenter_config tier add test_queue1 1000 1 1
```

### Add More Users

```
/scripts/add_user --confpath=/etc/freeswitch 1010
```

### Simulate Calls

Setup call to user 1001 from 1000 or simring users 1001 and 1002:

```
originate user/1000 9999 XML default
originate user/1000 &bridge(user/1001)
originate user/1000 &bridge({ignore_early_media=true}user/1001,user/1002)
```

### PSTN

When making calls to Twilio, make sure your geo permissions, source IP address and password are set correctly on elastic SIP trunk.

## Read Order

- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Miscellaneous/Overview_13174222
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Miscellaneous/Specifications_1048680
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Installation/Linux/Debian_67240088
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Introduction.mdx/#navigating-the-documentation
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Understanding-the-Configuration-Files/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Configuration/Configuring-FreeSWITCH/#configuration-files
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Directory/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Configuration/Reloading_13173616
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Call-Legs/#0-about
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Life-Cycle-of-a-Call/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Endpoints
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Configuration/Sofia-SIP-Stack/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Configuration/Sofia-SIP-Stack/Sofia-Configuration-Files_7144453/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Dialplan/XML-Dialplan/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Modules/mod_xml_curl_1049001/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Event-System/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Networking/3965687
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Networking/Auto-Nat_6587487
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Security/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Client-and-Developer-Interfaces/1048948
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Troubleshooting-Debugging/
- https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Databases/FreeSWITCH-Databases_13173016

## Books

- FreeSWITCH Cookbook
- FreeSWITCH 1.8
