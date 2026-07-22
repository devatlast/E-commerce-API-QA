#!/bin/bash

echo "Running users tests"
./users.sh
sleep 5

echo "Running cart tests"
./cart.sh
sleep 5

echo "Running products tests"
./products.sh
sleep 5

echo "Running orders tests"
./orders.sh
sleep 5


echo "All tests completed"