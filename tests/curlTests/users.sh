#!/bin/bash

BASE_URL="https://e-commerce-api-qa.vercel.app"

echo "-------Logging in as Admin-----"
ADMIN_RESPONSE=$(curl -X POST $BASE_URL/login -H "Content-Type: application/json" -d '{"email": "ola@email.com", "password":"admin1"}')
ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | jq -r '.token')
echo "$ADMIN_TOKEN"

if [ -z $ADMIN_TOKEN ] || [ "$ADMIN_TOKEN" = "null" ]; then
  echo "Admin login failed"
  exit 1
fi  
sleep 2

echo "--------logging in as user-----------"
USER_RESPONSE=$( curl -X POST $BASE_URL/login -H "Content-Type:application/json" -d '{"email":"tolu@email.com", "password": "tolu1st"}')
USER_TOKEN=$(echo "$USER_RESPONSE" | jq -r '.token')
echo "$USER_TOKEN"

if [ -z %USER_TOKEN ] || [ "$USER_TOKEN" = "null" ]; then 
 echo "User login failed"
 exit 1
fi

sleep 4



echo "---------Performing ADMIN CRUD operations---------------- "

echo "Getting all users - Admin"
curl -X GET "$BASE_URL/users" -H "Authorization: Bearer $ADMIN_TOKEN"
sleep 2

echo "Creating new user"
RESPONSE=$(curl -X POST "$BASE_URL/users" -H "Content-Type:application/json" -d '{"first_name":"ola", "last_name":"tide", "email": "laide@email.com", "password":"james1"}')
echo "$RESPONSE"
USER_ID=$(echo "$RESPONSE" | jq -r '.id')
sleep 2
echo "updating user profile"
curl -X PUT "$BASE_URL/users/$USER_ID" -H "Authorization: Bearer $ADMIN_TOKEN " -H "Content-Type:application/json" -d '{"first_name": "olat", "last_name":"michael", "role":"user", "email":"oyide@email.com", "password":"james12"}'
echo "deleting user profile from database"
curl -X DELETE "$BASE_URL/users/$USER_ID" -H "Authorization: Bearer $ADMIN_TOKEN" 
sleep 1
echo "------------ADMIN CRUD operations performed successfully------------"
sleep 4


echo "---------WAITING---------"
sleep 2


echo "-----------Performing USER accessible CRUD Operations-------------"
curl -X GET "$BASE_URL/users/me" -H "Authorization: Bearer $USER_TOKEN"
sleep 2

echo "creating a new user"
curl -X POST "$BASE_URL/users" -H "Content-Type:application/json" -d '{"first_name":"rotimi", "last_name":"wale", "email": "roti@email.com", "password":"olaroti1"}'
sleep 2
echo "logging in as new user"
USER_DATA=$(curl -X POST "$BASE_URL/login" -H "Content-Type: application/json" -d '{"email":"roti@email.com", "password": "olaroti1"}')
NEWUSER_TOKEN=$( echo "$USER_DATA" | jq -r '.token')
sleep 2
echo "updating user details"
curl -X PUT "$BASE_URL/users/me" -H "Authorization: Bearer $NEWUSER_TOKEN" -H "Content-Type:application/json" -d '{"first_name":"olarotimi", "last_name":"olawale", "email":"olaroti@email.com", "password":"olaroti12"}'
sleep 2
echo "---user deleting profile---"
curl -X DELETE "$BASE_URL/users/me" -H "Authorization: Bearer $NEWUSER_TOKEN"
sleep 2
echo "------------USER accessible CRUD Operations performed successfully ------------"
