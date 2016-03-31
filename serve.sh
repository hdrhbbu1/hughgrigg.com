#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

rm -rf ./public/*
hugo version
hugo server --config=config.yaml --theme=2016 --buildDrafts -v -w
