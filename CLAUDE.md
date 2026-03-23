 # CLAUDE.md
 
 ## Project Overview
 
 Containerized SIP telephony system integrating three core components:
 - **Kamailio** — SIP signaling router (routes requests between softphones and FreeSWITCH)
 - **FreeSWITCH** — PBX (call processing, voicemail, IVR, call queues)
 - **RTPEngine** — Media proxy (bridges WebRTC↔SIP, NAT traversal, SRTP/DTLS)
 
 All services run in Docker containers with `--network host`. PostgreSQL 17 is used for both Kamailio (location/registration) and FreeSWITCH (core, sofia, voicemail).
 
 ## Architecture
 
 ```
 Softphones/WebRTC → Kamailio (5060/5061/5080)  →  FreeSWITCH (5080)
                          ↕                            ↕
                     RTPEngine (2223-2225)         Configurator (8080/8081)
                          ↕                            ↕
                     PostgreSQL 17                 ESL / mod_xml_curl
 ```
 
 - Kamailio handles SIP routing, NAT detection, TLS termination, and RTPEngine integration
 - FreeSWITCH fetches dynamic configuration from the **Configurator** REST API via `mod_xml_curl` (falls back to filesystem XML)
 - The Configurator also runs an ESL (Event Socket Layer) server for programmatic call control
 - Kamailio and RTPEngine use template configs (`*-schema.*`) with PRIVATE_IP/PUBLIC_IP placeholders substituted at container startup by entrypoint scripts
 
 ## Configurator (freeswitch/configurator/)
 
 TypeScript/Node.js service — the only application code in the repo.
 
 **Stack:** TypeScript 5.6, Node.js 20, Koa, modesl (ESL client), xml2js
 
 ### Commands
 
 ```bash
 npm install
 npm start          # build + run
 npm run build      # TypeScript compile only
 npm run lint       # eslint
 npm run format     # prettier
 ```
 
 ### Code Style
 - ESLint 9.x flat config, Prettier (single quotes, ES5 trailing commas, 2-space indent)
 - TypeScript strict mode, target ES2023, CommonJS modules
 
 ### Key Files
 - `src/server.ts` — entry point
 - `src/rest.ts` — Koa app and router setup
 - `src/api.ts` — route handlers: `/health`, `/esl` (call control), `/fs` (FreeSWITCH XML config)
 - `src/events.ts` — ESL server that listens for FreeSWITCH events and accepts inbound connections
 - `src/config.ts` — configuration from environment variables
 
 ## Docker Build Commands
 
 ```bash
 # Kamailio
 docker build -t kamailio:local kamailio/
 docker run --name kamailio --network host -v $(pwd)/kamailio/etc:/etc/kamailio -d kamailio:local
 
 # RTPEngine
 docker build -t rtpengine:local rtpengine/
 docker run --name rtpengine --network host -v $(pwd)/rtpengine/etc:/etc/rtpengine -d rtpengine:local
 
 # FreeSWITCH (requires SignalWire token)
 docker build --build-arg TOKEN=$(cat freeswitch/signalwire.token) -t freeswitch:local freeswitch/
 docker run --name freeswitch --network host --cap-add SYS_NICE -v $(pwd)/freeswitch/etc:/etc/freeswitch -d freeswitch:local
 ```
 
 ## Test Extensions
 
 - 1000, 1001, 1002 — user extensions (password: 12345)
 - 8888 — ESL dialplan test, 9999 — XML dialplan test
 - 7777 — voicemail, 6xxx — FIFO queues, 555x — call center queues
 
 ## CLI Debugging Tools
 
 - `sngrep` — SIP packet capture/inspection
 - `fs_cli` — FreeSWITCH console (port 8021, default password: ClueCon)
 - `kamcmd` — Kamailio management
 - `rtpengine-ctl` — RTPEngine session management