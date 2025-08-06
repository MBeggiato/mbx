#!/bin/bash

# Production Deployment Script for Mbx Homepage

set -e

echo "🚀 Starting Mbx Homepage Production Deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production from .env.example"
    exit 1
fi

# Load production environment
export $(cat .env.production | grep -v '#' | xargs)

echo "📋 Configuration:"
echo "  - App Port: ${APP_PORT:-3000}"
echo "  - Database: ${POSTGRES_DB}"
echo "  - Domain: ${DOMAIN:-localhost}"

# Build and start services
echo "🏗️  Building application..."
docker compose -f docker-compose.prod.yml build --no-cache

echo "🗄️  Starting database..."
docker compose -f docker-compose.prod.yml up -d db

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🚀 Starting application..."
docker compose -f docker-compose.prod.yml up -d app

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your Mbx Homepage is now running at:"
echo "   - Application: http://localhost:${APP_PORT:-3000}"
echo "   - Database: localhost:${POSTGRES_PORT:-5432}"

# Optional: Start pgAdmin
read -p "🤔 Do you want to start pgAdmin for database administration? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🛠️  Starting pgAdmin..."
    docker compose -f docker-compose.prod.yml --profile admin up -d pgadmin
    echo "   - pgAdmin: http://localhost:${PGADMIN_PORT:-5050}"
fi

echo ""
echo "📊 To view logs:"
echo "   docker compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker compose -f docker-compose.prod.yml down"
