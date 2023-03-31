#!/bin/bash
dir=$(dirname "$0")/..
"$dir/node_modules/.bin/c8" --skip-full "$dir/bin/test.sh"
