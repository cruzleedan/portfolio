# Docker Deployment Guide

## Prerequisites

- Docker installed on your Ubuntu homelab server
- Docker Compose installed (optional, but recommended)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository on your server:

```bash
git clone <your-repo-url>
cd portfolio
```

2. Build and run:

```bash
docker-compose up -d
```

3. Access your portfolio at `http://your-server-ip:3000`

### Option 2: Using Docker directly

1. Build the image:

```bash
docker build -t portfolio-app .
```

2. Run the container:

```bash
docker run -d \
  --name portfolio \
  -p 3000:80 \
  --restart unless-stopped \
  portfolio-app
```

## Management Commands

### View logs

```bash
docker-compose logs -f portfolio
# or
docker logs -f portfolio
```

### Stop the application

```bash
docker-compose down
# or
docker stop portfolio
```

### Restart the application

```bash
docker-compose restart
# or
docker restart portfolio
```

### Update the application

```bash
git pull
docker-compose up -d --build
```

## Port Configuration

By default, the app runs on port 3000. To change this, edit the port mapping in `docker-compose.yml`:

```yaml
ports:
  - '8080:80' # Change 8080 to your desired port
```

## Reverse Proxy Setup (Optional)

For production, you may want to use a reverse proxy like Nginx or Traefik to:

- Handle SSL/TLS certificates
- Serve multiple applications
- Load balancing

### Example Nginx reverse proxy config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Check if container is running

```bash
docker ps
```

### Check container health

```bash
docker inspect --format='{{.State.Health.Status}}' portfolio
```

### Remove and rebuild

```bash
docker-compose down
docker-compose up -d --build --force-recreate
```
