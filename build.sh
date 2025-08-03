#!/bin/bash

# Build script for Chrome Extension - creates a clean zip for Chrome Web Store submission

echo "Building Chrome Extension package..."

# Create a temporary build directory
BUILD_DIR="build"
ZIP_NAME="add-book-to-goodreads-extension.zip"

# Remove existing build directory and zip file
rm -rf $BUILD_DIR
rm -f $ZIP_NAME

# Create build directory
mkdir $BUILD_DIR

# Copy only the files needed for the extension
cp manifest.json $BUILD_DIR/
cp popup.html $BUILD_DIR/
cp popup.js $BUILD_DIR/
cp popup-handler.js $BUILD_DIR/
cp myscript.js $BUILD_DIR/
cp -r images/ $BUILD_DIR/images/

# Create the zip file
cd $BUILD_DIR
zip -r ../$ZIP_NAME .
cd ..

# Clean up build directory
rm -rf $BUILD_DIR

echo "Extension package created: $ZIP_NAME"
echo "Files included:"
unzip -l $ZIP_NAME
