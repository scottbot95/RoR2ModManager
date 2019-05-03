#!/bin/bash

UNPACKED_DIR="./release/thunderstore-unpacked"
PACKAGE_NAME=$(jq -r '.name' package.json)
PACKAGE_VERSION=$(jq -r '.version' package.json)
PRODUCT_NAME=$(jq -r '.productName' electron-builder.json)
ZIP_FILE="$PACKAGE_NAME-$PACKAGE_VERSION.zip"
RELEASE_FILE="$PRODUCT_NAME Setup $PACKAGE_VERSION.exe"

echo UNPACKED_DIR=$UNPACKED_DIR
echo PACKAGE_NAME=$PACKAGE_NAME
echo PACKAGE_VERSION=$PACKAGE_VERSION
echo PRODUCT_NAME=$PRODUCT_NAME
echo ZIP_FILE=$ZIP_FILE
echo RELEASE_FILE=$RELEASE_FILE



# Create unpacked dir
mkdir -p "$UNPACKED_DIR"
# create manifest.json
jq '{name:"RoR2ModManager", version_number:.version, website_url:.homepage, description:.description, dependencies:[]}' package.json > "$UNPACKED_DIR/manifest.json"
cd $UNPACKED_DIR
# link rest of files
# rm "$RELEASE_FILE"; ln "../$RELEASE_FILE"
rm icon.png; ln "../../src/favicon.256x256.png" icon.png

# Create thunderstore readme
sed '/# For Developers/Q' ../../README.md > README.md
cat ../../CHANGELOG.md >> README.md

zip -r $ZIP_FILE .

mv $ZIP_FILE ..
