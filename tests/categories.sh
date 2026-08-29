#!/bin/bash

BASE_URL="https://e-commerce-api-qa.vercel.app"


echo "Logging in as Admin"
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



echo "-----ADMIN views all available categories-----"
curl -X GET "$BASE_URL/category/all" -H "Authorization: Bearer $ADMIN_TOKEN"
sleep 2

echo "-----USER viewing available categories-----"
curl -X GET "$BASE_URL/category/me" -H "Authorization: Bearer $USER_TOKEN"
sleep 2

echo "Adding new category --- Admin "
New_category=$( curl -X POST "$BASE_URL/category" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"name":"computing"}')
Category_id=$( echo "$New_category" | jq -r '.id')
sleep 2

echo "Updating category"
Updated_category=$( curl -X PATCH "$BASE_URL/category/$Category_id" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"name": "Updated Computing"}' )
Updated_id=$( echo "$Updated_category" | jq -r '.id')
sleep 2

echo "Deleting from category list ---- Admin "
curl -X DELETE "$BASE_URL/category/$Updated_id" -H "Authorization: Bearer $ADMIN_TOKEN"

echo "----All CRUD operations in categories performed successfully-----"

