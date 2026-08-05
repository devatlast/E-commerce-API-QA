#!/bin/bash

BASE_URL="http://localhost:3000"

echo "logging in as Admin"
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



echo "Getting all Products"
curl -X GET "$BASE_URL/products" -H "Authorization: Bearer $USER_TOKEN"
sleep 2

echo "Creating new product"
RESPONSE=$( curl -X POST "$BASE_URL/products" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type:application/json" -d '{"category_id":3, "name": "Men underwear", "description":"100% cotton boxers for men", "price":18.99, "stock":6 }')
echo "$RESPONSE"
PRODUCT_ID=$(echo $RESPONSE | jq -r '.id')
sleep 2


echo "Updating product"
curl -X PUT "$BASE_URL/products/$PRODUCT_ID" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type:application/json" -d '{"category_id":3, "name": "Underwear", "description": "100% unisex underwear", "price":18.65, "stock":4}'
sleep 2

echo "Deleting product from table"
curl -X DELETE "$BASE_URL/products/$PRODUCT_ID" -H "Authorization: Bearer $ADMIN_TOKEN"