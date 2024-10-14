#!/bin/bash

# Install Nginx
sudo apt update
sudo apt install -y nginx

# Create Nginx load balancer config file
sudo bash -c 'cat > /etc/nginx/sites-available/load_balancer.conf <<EOF
server {
    listen 80;  # Port 80 for HTTP traffic

    location / {
        root /path/to/your/frontend/build;  # Change this to your frontend build directory
        try_files \$uri \$uri/ /index.html;  # Serve index.html for routes not found
        # proxy_pass http://localhost:3000;  # Uncomment this line if you need to proxy the frontend server
    }

    location /api {
        proxy_pass http://localhost:3001;  # Forward traffic to PM2 cluster on port 3001
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Optional: WebSocket location (if you have a dedicated WebSocket endpoint)
    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;  # Adjust according to your socket.io setup
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;  # Handle WebSocket upgrade
        proxy_set_header Connection "upgrade";    # Maintain connection for WebSocket
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}
EOF'

# Enable the new Nginx config
sudo ln -s /etc/nginx/sites-available/load_balancer.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
if ! sudo nginx -t; then
    echo "Nginx configuration test failed. Please check your configuration."
    exit 1
fi

# Reload Nginx to apply changes
sudo systemctl reload nginx

# Install Node.js and PM2 if not already installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js..."
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -  # Install Node.js (version 16.x)
    sudo apt install -y nodejs
fi

# Install and start PM2 with Node.js app
sudo npm install -g pm2
pm2 start server.js -i max --name express-app
pm2 save
pm2 startup

echo "Setup complete! Nginx is configured as a load balancer for your Node.js app."

