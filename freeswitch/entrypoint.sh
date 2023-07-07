#!/bin/bash
echo 'FreeSWITCH networks:'
echo $(echo $(hostname -I | awk '{print $1}'))
echo $(echo $(curl -s http://checkip.amazonaws.com/))

trap 'freeswitch -stop' SIGINT SIGTERM
freeswitch -nf -nc -nonat &
pid="$!"
wait $pid
exit 0
