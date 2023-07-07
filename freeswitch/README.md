## FreeSWITCH Docker

### Access Token

Create SignalWire access token:
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Installation/HOWTO-Create-a-SignalWire-Personal-Access-Token_67240087/

### FreeSWITCH Source

Clone FreeSWITCH repo:
https://github.com/signalwire/freeswitch/tree/v1.10.9

Later the `scripts` directory will be mounted the corresponding container.

### Build Image

```
docker build \
--build-arg TOKEN=$(cat signalwire.token) \
-t freeswitch:local .

docker run --name freeswitch \
--network host \
--cap-add SYS_NICE \
-v $(pwd)/etc:/etc/freeswitch \
-v ~/Documents/freeswitch/scripts/perl:/scripts \
-d freeswitch:local

docker exec -it freeswitch fs_cli

docker exec -it freeswitch sngrep

docker stop freeswitch && docker rm freeswitch
```

_Note: to get default config, run image w/o config voulme, then copy config to local directory:_

```
docker cp freeswitch:/etc/freeswitch etc_default
```

## Misc

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

### Add More Users

```
/scripts/add_user --confpath=/etc/freeswitch 1010
```

### Simulate Calls

Setup call to user 1001 from 1000 or simring users 1001 and 1002:

```
originate user/1000 &bridge(user/1001)
originate user/1000 &bridge({ignore_early_media=true}user/1001,user/1002)
```

### PSTN

When making calls to Twilio, make sure your geo permissions, source IP address and password are set correctly on elastic SIP trunk.

## Read Order

https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Miscellaneous/Overview_13174222
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Miscellaneous/Specifications_1048680
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Installation/Linux/Debian_67240088
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Understanding-the-Configuration-Files_15696295
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Directory/
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Configuration/Reloading_13173616
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Call-Legs_7143972
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Endpoints_15696294
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Life-Cycle-of-a-Call_1048888
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Configuration/Sofia-SIP-Stack/
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Dialplan/XML-Dialplan/
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Modules/mod_xml_curl_1049001/
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Troubleshooting-Debugging/
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Client-and-Developer-Interfaces/1048948
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Introduction/Event-System/
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Networking/3965687
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Networking/Auto-Nat_6587487
https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Security/
