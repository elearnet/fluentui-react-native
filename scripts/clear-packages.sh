#!/bin/bash
#find .. -type d -name "node_modules" -print
find .. -type d -name "node_modules" -exec rm -rf {} +
#rm ../yarn.lock
echo 'finished'
