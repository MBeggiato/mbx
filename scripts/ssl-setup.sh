#!/bin/bash

# SSL Certificate Setup Script (using Let's Encrypt)

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <domain>"
    echo "Example: $0 your-domain.com"
    exit 1
fi

DOMAIN=$1
SSL_DIR="./nginx/ssl"

echo "🔒 Setting up SSL for $DOMAIN..."

# Create SSL directory
mkdir -p $SSL_DIR

# Generate SSL certificate with Let's Encrypt
docker run --rm \
    -v "${PWD}/nginx/ssl:/etc/letsencrypt" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --email ${SSL_EMAIL:-admin@${DOMAIN}} \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Copy certificates to nginx directory
cp "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" "${SSL_DIR}/cert.pem"
cp "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" "${SSL_DIR}/key.pem"

echo "✅ SSL certificates generated for $DOMAIN"
echo "📝 Update your nginx configuration with the domain name"
