#!bin/sh
SERVER=172.18.1.176
PORT=80
ENDPOINT=sign-in

# signIn
NAME_USER='angelloor.dev@gmail.com'
PASSWORD_USER='J0oxaiK1wrJ1puhHL7dc9Q=='

json_body_signin=$( jo -- -s name_user="$NAME_USER" -s password_user="$PASSWORD_USER")

TOKEN=$(curl -d $json_body_signin -H "Content-Type: application/json" -X POST http://$SERVER:$PORT/app/core/auth/$ENDPOINT | jq '.body.access_token')
echo $TOKEN;