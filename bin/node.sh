#!/bin/bash
dir=$(dirname "$0")/..
node --no-warnings=ExperimentalWarning --enable-source-maps --loader "$dir/loader.mjs" "$@"