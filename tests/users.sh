#!/bin/bash

BASE_URL="http://localhost:3000"

echo "Logging in as Admin"
ADMIN_RESPONSE=$(curl -X POST $BASE_URL/login -H "Content-Type: application/json" -d '{"email": "ola@email.com", "password":"admin1"}')
ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | jq -r '.token')
echo "$ADMIN_TOKEN"

if [ -z $ADMIN_TOKEN ] || [ "$ADMIN_TOKEN" = "null" ]; then
  echo "Admin login failed"
  exit 1
fi  

sleep 2

echo "logging in as user"
USER_RESPONSE=$( curl -X POST $BASE_URL/login -H "Content-Type:application/json" -d '{"email":"tolu@email.com", "password": "tolu1st"}')
USER_TOKEN=$(echo "$USER_RESPONSE" | jq -r '.token')
echo "$USER_TOKEN"

if [ -z %USER_TOKEN ] || [ "$USER_TOKEN" = "null" ]; then 
 echo "User login failed"
 exit 1
fi

sleep 2

echo "Getting all users - Admin"
curl -X GET "$BASE_URL/users" -H "Authorization: Bearer $ADMIN_TOKEN"
sleep 2

echo "Getting user details-- User"
curl -X GET "$BASE_URL/users/me" -H "Authorization: Bearer $USER_TOKEN"

echo "Creating new user"
RESPONSE=$(curl -X POST "$BASE_URL/users" -H "Content-Type:application/json" -d '{"first_name":"ola", "last_name":"tide", "email": "laide@email.com", "password":"james1"}')
echo "$RESPONSE"
USER_ID=$(echo "$RESPONSE" | jq -r '.id')
sleep 2

echo "Updating User - Admin "
curl -X PUT "$BASE_URL/users/$USER_ID" -H "Authorization: Bearer $ADMIN_TOKEN " -H "Content-Type:application/json" -d '{"first_name": "olat", "last_name": "iyide", "email":"oyide@email.com", "password":"james12"}'
NEW_USER=$( curl -X POST "$BASE_URL/login" -H "Content-Type: application/json" -d '{"email":"oyide@email.com", "password":"james12"}')
NEW_TOKEN=$(echo "$NEW_USER" | jq -r '.token')
curl -X DELETE "$BASE_URL/users/me" -H "Authorization: Bearer $NEW_TOKEN" 
sleep 2




echo "Removing user from database"
curl -X POST "$BASE_URL/users" -H "Content-Type:application/json" -d '{"first_name":"rotimi", "last_name":"wale", "email": "roti@email.com", "password":"olaroti1"}'
USER_DATA=$(curl -X POST "$BASE_URL/login" -H "Content-Type: application/json" -d '{"email":"roti@email.com", "password": "olaroti1"}')
USER1_TOKEN=$( echo "$USER_DATA" | jq -r '.token')
curl -X DELETE "$BASE_URL/users/me" -H "Authorization: Bearer $USER1_TOKEN"
