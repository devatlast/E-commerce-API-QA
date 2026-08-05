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



echo "Getting all categories --- Admin "
curl -X GET "$BASE_URL/category" -H "Authorization: Bearer $ADMIN_TOKEN"
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