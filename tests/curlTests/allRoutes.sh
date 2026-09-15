#!/bin/bash

echo "--------Running users tests-------"
.tests/curlTests/users.sh
echo "user tests run successfully------"
echo "------WAITING------"
sleep 5

echo "-----Running categories tests-------"
./tests/curlTests/categories.sh
echo "------categories test run successfully-------" 
echo "------WAITING------"
sleep 5

echo "-------Running products tests------"
./tests/curlTests/products.sh
echo "-------products test run successfully----"
echo "------WAITING------"
sleep 5

echo "-------Running cart tests-------"
./tests/curlTests/cart.sh
echo "------Cart tests performed successfully------"
echo "------WAITING------"
sleep 5

echo "------Running orders tests------"
./tests/curlTests/orders.sh
echo "-------orders tests run successfully-----"
sleep 5

echo "All tests completed"