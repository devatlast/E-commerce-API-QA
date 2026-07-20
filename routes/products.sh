#!/bin/bash

BASE_URL="http://localhost:3000"

echo "Getting all Products"
echo "$BASE_URL/products"
sleep 2

echo "Creating new product"
RESPONSE=$( curl -X POST "$BASE_URL/products" -H "Content-Type:application/json" -d '{"category_id":3, "name": "Men underwear", "description":"100% cotton boxers for men", "price":18.99, "stock":6 }')
echo "$RESPONSE"
PRODUCT_ID=$(echo $RESPONSE | jq -r '.id')
sleep 2


echo "Updating product"
curl -X PUT "$BASE_URL/products/$PRODUCT_ID" -H "Content-Type:application/json" -d '{"category_id":3, "name": "Underwear", "description": "100% unisex underwear", "price":18.65, "stock":4}'
sleep 2

echo "Deleting product from table"
curl -X DELETE "$BASE_URL/products/$PRODUCT_ID"