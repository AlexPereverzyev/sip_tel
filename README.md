# Kamailio + FreeSWITCH

The projects demonstrates how tenants softphones and FreeSWITCH PBXs can be connected to each other using Kamailio SIP router to enable advanced calls routing, logging, measurements and NAT traversal.

## Main Use Case

Remote softphones register on edge SIP routers (Kamailio), that accept registrations and route SIP requests to pre-configured softphone PBX (FreeSWITCH). In response to SIP invite, PBX simualteniosly rings extension on the corresponding local and remote softphones or sends SIP to PSTN gateway (Twilio). Local PBX softphones are able to reach out to remote softphones via the same SIP router.

## Implementation Details

-   scalable SIP router configuration
-   persistent TCP connections with softphone clients and PBXs
-   SIP requests are proxied to the exact instance where target softphone/PBX is registered
-   locations and extension to PBX mappings are stored in shared PostgreSQL database
-   only standard Kamailio modules used: usrloc, registrar, postgres, sqlops, nathelper
-   tested with Linphone and Zoiper softphones on Linux and Android

## Usage

To build Docker images and start Kamailio and FreeSWITCH go through readme files. Make sure your local network is 192.168.0.0/24, otherwise update the configs. If all good, Kamailio and FreeSWITCH should be listening on ports 5080 and 5060 (`netstat -ntlp`). Then configure PBX mappings in database and start registering softphones on Kamailio or FreeSWITCH with extensions 1000-1002 and password 12345.
