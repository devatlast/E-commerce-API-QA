#!/bin/bash

echo "--------Running users tests-------"
./users.sh
echo "user tests run successfully------"
echo "------WAITING------"
sleep 5

echo "-----Running categories tests-------"
./category.sh
echo "------categories test run successfully-------" 
echo "------WAITING------"
sleep 5

echo "-------Running products tests------"
./products.sh
echo "-------products test run successfully----"
echo "------WAITING------"
sleep 5

echo "-------Running cart tests-------"
./cart.sh
echo "------Cart tests performed successfully------"
echo "------WAITING------"
sleep 5

echo "------Running orders tests------"
./orders.sh
echo "-------orders tests run successfully-----"
sleep 5

echo "All tests completed"