#!bin/sh
cd /home/gadmpastaza/wsfe-backend/scripts/
SERVER=172.18.1.176
PORT=80
ENDPOINT=sendVoucherByBatchByTaxpayer

# signIn
TOKEN=$( sh signIn.sh | sed 's/\"//g');
#echo $TOKEN;
# signIn
DATE=`date '+%Y-%m-%d %H:%M:%S'`
ID_USER_=1
ID_TAXPAYER=1
TYPE_VOUCHER=01
#echo $TYPE_VOUCHER;
LOG_FILE=./../file_store/log/sendVoucherByBatchByTaxpayer_1_$(date +%d-%m-%Y_%H-%M-%S).json

json_id_taxpayer=$( jo id_taxpayer="$ID_TAXPAYER")
json_taxpayer=$( jo taxpayer="$json_id_taxpayer")
json_body=$( jo -- -n id_user_="$ID_USER_" -n institution="$json_taxpayer" -s type_voucher="$TYPE_VOUCHER" -s emission_date_voucher=\"$DATE\")

#echo $json_body;

RESPONSE=$(curl -d $json_body -H "Content-Type: application/json" -H "token: $TOKEN" -X POST http://$SERVER:$PORT/app/business/voucher/$ENDPOINT | jq '.body')

sleep 5 &
wait

echo $RESPONSE > $LOG_FILE;