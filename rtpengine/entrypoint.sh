#!/bin/bash
echo 'RTPEngine networks:'
LOCAL_IP=$(echo $(hostname -I | awk '{print $1}'))
EXTERNAL_IP=$(echo $(curl -s http://checkip.amazonaws.com/))
echo $LOCAL_IP
echo $EXTERNAL_IP

if [ -e "/etc/rtpengine/rtpengine-schema.conf" ]; then
    cp "/etc/rtpengine/rtpengine-schema.conf" "/etc/rtpengine/rtpengine.conf"
    sed -i "s/PRIVATE_IP/$LOCAL_IP/g" /etc/rtpengine/rtpengine.conf
    sed -i "s/PUBLIC_IP/$EXTERNAL_IP/g" /etc/rtpengine/rtpengine.conf
fi

trap 'rtpengine-ctl terminate all && kill $(cat /run/rtpengine.pid)' SIGINT SIGTERM
rtpengine --config-file=/etc/rtpengine/rtpengine.conf &
pid="$!"
wait $pid
exit 0
