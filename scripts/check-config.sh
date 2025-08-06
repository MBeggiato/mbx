#!/bin/bash

echo "🔧 Mbx Homepage - Environment Configuration"
echo "============================================="
echo ""

if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please run: cp .env.example .env"
    echo ""
    exit 1
fi

echo "✅ Environment file found: .env"
echo ""

echo "📊 Current Configuration:"
echo "------------------------"

# Read and display key configuration values (without passwords)
echo "🗄️  Database:"
echo "   Database Name: $(grep '^POSTGRES_DB=' .env | cut -d '=' -f2)"
echo "   Database User: $(grep '^POSTGRES_USER=' .env | cut -d '=' -f2)"
echo "   Database Port: $(grep '^POSTGRES_PORT=' .env | cut -d '=' -f2)"
echo ""

echo "🔧 pgAdmin:"
echo "   Email: $(grep '^PGADMIN_DEFAULT_EMAIL=' .env | cut -d '=' -f2)"
echo "   Port: $(grep '^PGADMIN_PORT=' .env | cut -d '=' -f2)"
echo ""

echo "🔗 URLs:"
POSTGRES_PORT=$(grep '^POSTGRES_PORT=' .env | cut -d '=' -f2)
PGADMIN_PORT=$(grep '^PGADMIN_PORT=' .env | cut -d '=' -f2)
echo "   Application: http://localhost:3000"
echo "   pgAdmin: http://localhost:${PGADMIN_PORT:-5050}"
echo "   Database: localhost:${POSTGRES_PORT:-5433}"
echo ""

echo "🚀 Quick Start:"
echo "   docker compose up -d"
echo "   bun dev"
echo ""
