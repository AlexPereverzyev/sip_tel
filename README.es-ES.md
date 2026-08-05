

## Configuración Simple, Modificable y en Contenedores de Kamailio, RTPEngine y FreeSWITCH

Este proyecto demuestra cómo Kamailio, un enrutador SIP, puede conectar softphones y PBX FreeSWITCH para inquilinos. Habilita funcionalidades como enrutamiento avanzado de llamadas, registro de eventos, mediciones y traversal de NAT.

## Caso de Uso Principal

Los softphones remotos se registran en Kamailio, que enruta las solicitudes SIP a PBX FreeSWITCH preconfiguradas. Cuando llega una llamada a FreeSWITCH, hace sonar simultáneamente los softphones locales y remotos y/o envía la llamada a una puerta de enlace PSTN (Twilio). Los softphones locales (internos) también pueden realizar llamadas a softphones remotos a través de Kamailio.

RTPEngine se utiliza como proxy de medios para garantizar que los dispositivos detrás de un NAT simétrico puedan enviar medios entre sí y para conectar clientes SIP tradicionales con clientes WebRTC.

```
|----------|   SRTP/DTLS    |------------| 
| Browser  |<-------------->|            |
| SIP.js   |----\   (S)RTP  | RTPEngine  |<-------|
| Ext 1002 |     \/-------->|            |        |
|----------|     /\         |------------|        |
                /  \              | NGCP          |                            

|----------|   / SIP\WS\WSS |------------|        |
| Mobile   |<-/      \----->|            |        | (S)RTP
| Linphone |  SIP\TCP\TLS   | Kamailio   |        |  
| Ext 1001 |--------------->|            |---------->|------------|
|----------|                |------------|        |  |            |
                                  | SIP\TCP\TLS   |  | PostgreSQL |
|----------|  SIP\TCP\TLS   |------------|        |  |            |
| Desktop  |--------------->|            |---------->|------------| 
| Linphone |    (S)RTP      | FreeSWITCH |<-------|  |------------|
| Ext 1000 |<-------------->|            |  ESL,REST |Configurator| 
|----------|                |------------|---------->|------------|
```

## Implementación

* Configuración escalable de enrutador SIP y proxy de medios
* Conexiones de señalización persistentes TCP/TLS/WSS y medios seguros
* Las solicitudes SIP se enrutan a la instancia específica donde está registrado el softphone/PBX destino
* Las ubicaciones y los mapeos de extensiones se almacenan en una base de datos PostgreSQL compartida
* Utiliza únicamente módulos estándar de Kamailio: usrloc, registrar, postgres, sqlops, nathelper, tls
* Probado con los softphones Linphone y Zoiper en Linux y Android, y el cliente WebRTC SIP.js
* FreeSWITCH utiliza una aplicación configuradora en Node.js, que sirve el dialplan a través de una API REST
* FreeSWITCH está configurado para usar PostgreSQL en los módulos core, sofia y voicemail

## Uso

Siga las instrucciones en los archivos `README.md` (en orden) para generar las imágenes de Docker e iniciar RTPEngine, Kamailio y FreeSWITCH. Actualice las configuraciones si su red no es 192.168.0.0/24.

Una vez en ejecución, Kamailio y FreeSWITCH deberían estar escuchando en los puertos estándar (5060, 5061, 5080) y RTPEngine en los puertos 2223-2225 (verifique con `netstat -ntlp` o `nulp`). Configure los mapeos de PBX en la base de datos, registre los softphones (extensiones 1000-1002, contraseña 12345) en Kamailio (externo) o FreeSWITCH (interno), y comience a realizar llamadas.
