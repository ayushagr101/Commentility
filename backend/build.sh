#!/bin/bash

# Render Build Script for Backend
echo "🚀 Starting Commentility Backend Build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Python is available for sentiment analysis
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    
    # Install Python dependencies if requirements.txt exists
    if [ -f "requirements.txt" ]; then
        echo "📦 Installing Python dependencies..."
        pip3 install -r requirements.txt
    fi
else
    echo "⚠️  Python 3 not found - sentiment analysis may not work"
fi

echo "✅ Backend build complete!"
