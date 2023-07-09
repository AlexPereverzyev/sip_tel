#!/bin/bash

set -e
cd etc/tls

openssl genrsa -out cakey.pem 2048
openssl req -x509 -new -nodes -sha256 -days 365 -key cakey.pem -out cacert.pem -subj /C=US/ST=CA/L=Void/O=Test/CN=TestCA

LOCAL_IP=$(echo $(hostname -I | awk '{print $1}'))
openssl genrsa -out kamailiokey.pem 2048
openssl req -new -sha256 -key kamailiokey.pem -subj /C=US/ST=CA/L=Void/O=Test/CN=$LOCAL_IP -out kamailio.csr
openssl x509 -req -sha256 -days 365 -CAcreateserial -in kamailio.csr -CA cacert.pem -CAkey cakey.pem -out kamailiocert.pem 

openssl genrsa -out freeswitchkey.pem 2048
openssl req -new -sha256 -key freeswitchkey.pem -subj /C=US/ST=CA/L=Void/O=Test/CN=freeswitch -out freeswitch.csr
openssl x509 -req -sha256 -days 365 -CAcreateserial -in freeswitch.csr -CA cacert.pem -CAkey cakey.pem -out freeswitchcert.pem 

openssl genrsa -out ext1002key.pem 2048
openssl req -new -sha256 -key ext1002key.pem -subj /C=US/ST=CA/L=Void/O=Test/CN=ext1002 -out ext1002.csr
openssl x509 -req -sha256 -days 365 -CAcreateserial -in ext1002.csr -CA cacert.pem -CAkey cakey.pem -out ext1002cert.pem 

cd ../..
