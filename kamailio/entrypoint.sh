#!/bin/sh
echo 'Kamailio networks:'
LOCAL_IP=$(echo $(hostname -I | awk '{print $1}'))
EXTERNAL_IP=$(echo $(curl -s http://checkip.amazonaws.com/))
echo $LOCAL_IP
echo $EXTERNAL_IP

if [ -e "/etc/kamailio/kamailio-temp.cfg" ]; then
    cp "/etc/kamailio/kamailio-temp.cfg" "/etc/kamailio/kamailio.cfg"
    sed -i "s/PRIVATE_IP/$LOCAL_IP/g" /etc/kamailio/kamailio.cfg
    sed -i "s/PUBLIC_IP/$EXTERNAL_IP/g" /etc/kamailio/kamailio.cfg
fi

trap 'kamctl stop' INT TERM
kamailio -DD -P /run/kamailio/kamailio.pid -f /etc/kamailio/kamailio.cfg &
pid="$!"
wait $pid
exit 0
