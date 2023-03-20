#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Please create a .env file with the required variables."
  exit 1
fi