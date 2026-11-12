#!/bin/sh
# Regenera la app desde las fuentes. Correr desde src/:  sh build.sh
set -e
cd "$(dirname "$0")"
mkdir -p netlify-app/public
python3 build.py && python3 build2.py && python3 build3.py && python3 build4.py && python3 build5.py && python3 build6.py
cp netlify-app/public/index.html ../public/index.html
echo "Listo: public/index.html (Netlify) y src/swipe-arcade.html (versión artifact de Claude)"
