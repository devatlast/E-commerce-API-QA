#!/bin/bash

BASE_URL="http://localhost:3000"

echo "Getting all users"
echo "$BASE_URL/users"
sleep 2

echo "Creating new user"
RESPONSE=$(curl -X POST "$BASE_URL/users" -H "Content-Type:application/json" -d '{"first_name":"itunu", "last_name":"jesus", "email": "itunu@email.com"}')
echo "$RESPONSE"
USER_ID=$(echo "$RESPONSE" | jq -r '.id')
sleep 2

echo "Updating User"
curl -X PUT "$BASE_URL/users/$USER_ID" -H "Content-Type:application/json" -d '{"first_name": "itunu", "last_name": "oluwa", "email":"updateditunu@email.com"}'
sleep 2


echo "Removing user from database"
curl -X DELETE "$BASE_URL/users/$USER_ID"