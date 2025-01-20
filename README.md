## Connecting Softphones and FreeSWITCH PBXs with Kamailio + RTPEngine

This project demonstrates how Kamailio, a SIP router, can connect tenant FreeSWITCH PBXs and softphones. It enables features like advanced call routing, logging, measurements, and NAT traversal.

## Main Use Case

Remote softphones register with Kamailio, which routes SIP requests to the configured FreeSWITCH PBX. When a call arrives to FreeSWITCH, it rings both the local and remote softphones simultaneously and/or sends call to a PSTN gateway (Twilio). Local (internal) softphones can also make calls to remote softphones through Kamailio. RTPEngine is used as media proxy to ensure devices behind symmetric NAT can commmunicate with each other.

## Implementation

* Scalable SIP router and media proxy configuration
* Persistent TCP/TLS connections with softphones and PBXs
* SIP requests are routed to the specific instance where the target softphone/PBX is registered
* Locations and extension mappings are stored in a shared PostgreSQL database
* Uses standard Kamailio modules only: usrloc, registrar, postgres, sqlops, nathelper, tls
* Tested with Linphone and Zoiper softphones on Linux and Android
* FreeSWITCH uses a Node.js configurator app, that serves dialplan via REST API
* FreeSWITCH is configured to use PostgreSQL for core, sofia, and voicemail modules

## Usage

Follow the instructions in the `README.md` files (in order) to build Docker images and start RTPEngine, Kamailio, and FreeSWITCH. Update configurations if your network is not 192.168.0.0/24.

Once running, Kamailio and FreeSWITCH should be listening on standard ports (5060, 5061, 5080) and RTPEngine on ports 2223-2225 (verify with `netstat -ntlp` or `nulp`). Configure PBX mappings in the database, register softphones (extensions 1000-1002, password 12345) on Kamailio (external) or FreeSWITCH (internal), and start making calls.
