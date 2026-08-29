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

echo "logging in as user"
USER_RESPONSE=$( curl -X POST $BASE_URL/login -H "Content-Type:application/json" -d '{"email":"tolu@email.com", "password": "tolu1st"}')
USER_TOKEN=$(echo "$USER_RESPONSE" | jq -r '.token')
echo "$USER_TOKEN"

if [ -z $USER_TOKEN ] || [ "$USER_TOKEN" = "null" ]; then 
 echo "User login failed"
 exit 1
fi

sleep 2

echo "USER adding product to cart"
curl -X POST "$BASE_URL/cart" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type:application/json" -d '{ "product_id":2, "quantity": 2}'
sleep 2

echo "USER updating cart items"
curl -X PUT "$BASE_URL/cart/2" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type:application/json" -d '{"quantity": 4}'
sleep 2


echo "ADMIN views all carts "
curl -X GET "$BASE_URL/cart" -H "Authorization: Bearer $ADMIN_TOKEN"
sleep 2

echo "USER views cart items"
curl -X GET "$BASE_URL/cart/me" -H "Authorization: Bearer $USER_TOKEN"
sleep 2

echo "USER remove product from cart"
curl -X DELETE "$BASE_URL/cart/2" -H "Authorization: Bearer $USER_TOKEN"