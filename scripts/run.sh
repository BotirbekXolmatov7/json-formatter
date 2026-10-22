#!/usr/bin/env bash

# JSON Formatter & Object Viewer - Ishga tushirish skripti

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

echo "🚀 JSON Formatter ishga tushirilmoqda..."
node src/server/index.js
