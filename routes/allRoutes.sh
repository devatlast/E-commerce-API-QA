#!/bin/bash

echo "Running users CRUD Operations"
./users.sh
sleep 5

echo "Running cart CRUD Operations"
./cart.sh
sleep 5

echo "Running products CRUD Operations"
./products.sh
sleep 5

echo "All tests completed"