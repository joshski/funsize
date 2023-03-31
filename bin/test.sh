#!/bin/bash
dir=$(dirname "$0")/..
"$dir/bin/node.sh" "$dir/src/run-tests.ts" "$@"