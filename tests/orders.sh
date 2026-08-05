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



echo "Getting all orders - Admin "
curl "$BASE_URL/orders" -H "Authorization: Bearer $ADMIN_TOKEN"
sleep 2

echo "Getting orders - User "
curl "$BASE_URL/orders/me" -H "Authorization: Bearer $USER_TOKEN"
sleep 2

echo "Getting orders by Id - Admin "
NEW_ORDER=$( curl -X GET "$BASE_URL/orders/2" -H "Authorization: Bearer $ADMIN_TOKEN")
echo "$NEW_ORDER"
sleep 2

echo "Creating User orders"
curl -X POST "$BASE_URL/cart" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type:application/json" -d '{ "product_id":2, "quantity": 2}'
sleep 1
RESPONSE=$(curl  -X POST "$BASE_URL/orders" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" -d '{"user_id":2}')
echo "$RESPONSE"
ORDER_ID=$(echo "$RESPONSE" | jq -r '.order.id')
sleep 2

echo "Updating user order status"
NEW_RESPONSE=$( curl -X PATCH "$BASE_URL/orders/$ORDER_ID/status" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type:application/json" -d '{"status":"shipped"}')
sleep 2


echo "Deleting user order - Admin "
curl -X DELETE "$BASE_URL/orders/$ORDER_ID" -H "Authorization: Bearer $ADMIN_TOKEN"