#!/bin/bash
cd /home/gadmpastaza/wsfe-backend/scripts/
SERVER=172.18.1.176
PORT=80
ENDPOINT=bringVouchersOfSQLServer

# signIn
TOKEN=$( sh signIn.sh | sed 's/\"//g');
#echo $TOKEN;
# signIn
DATE=`date '+%Y-%m-%d %H:%M:%S'`
#echo $DATE;
ID_USER_=1
ID_INSTITUTION=2
LOG_FILE=./../file_store/log/bringVouchersOfSQLServer_2_$(date +%d-%m-%Y_%H-%M-%S).json

json_id_institution=$( jo id_institution="$ID_INSTITUTION")
json_body=$( jo id_user_="$ID_USER_" institution="$json_id_institution" emission_date_voucher=\"$DATE\")

RESPONSE=$(curl -d $json_body -H "Content-Type: application/json" -H "token: $TOKEN" -X POST http://$SERVER:$PORT/app/business/voucher/$ENDPOINT | jq '.body')

sleep 5 &
wait

echo $RESPONSE > $LOG_FILE;
