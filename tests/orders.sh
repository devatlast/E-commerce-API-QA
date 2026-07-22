#!/bin/bash

BASE_URL="http://localhost:3000"

echo "Getting Orders"
curl "$BASE_URL/orders"
sleep 2

echo "Getting orders by user Id"
curl "$BASE_URL/orders/user/1"
sleep 2

echo "Getting orders by Id"
curl "$BASE_URL/orders/2"
sleep 2

echo "Creating User orders"
RESPONSE=$(curl -s -X POST "$BASE_URL/orders/3")
echo "$RESPONSE"
ORDER_ID=$(echo "$RESPONSE" | jq -r '.order.id')
sleep 2

echo "Updating user order status"
curl -X PATCH "$BASE_URL/orders/$ORDER_ID/status" -H "Content-Type:application/json" -d '{"status":"shipped"}'
sleep 2

echo "Orders tested successfully"