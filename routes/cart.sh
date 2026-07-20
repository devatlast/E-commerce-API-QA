#!/bin/bash



BASE_URL="http://localhost:3000"

echo "Getting user cart items"
curl "$BASE_URL/cart/1"
sleep 2

echo "Adding new item to user cart"
curl -X POST "$BASE_URL/cart" -H "Content-Type:application/json" -d '{"user_id":1, "product_id":2, "quantity": 2}'
sleep 2

echo "Updating user cart items"
curl -X PUT "$BASE_URL/cart/1/2" -H "Content-Type:application/json" -d '{"quantity": 1}'
sleep 2

echo "Removng Item from User cart"
curl -X DELETE "$BASE_URL/cart/1/2"