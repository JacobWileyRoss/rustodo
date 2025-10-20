# Docker Deployment Guide for Rustodo

This guide explains how to run Rustodo using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 24.0 or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or later)

## Quick Start

### Step 1: Configure Environment Variables (Optional)

Copy the example environment file and customize it if needed:

```bash
cp env.example .env
```

Edit the `.env` file to change default passwords and ports:

```bash
# .env
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_USER=your_username
MYSQL_PASSWORD=your_secure_password

# If port 3000 is already in use, change it here
BACKEND_PORT=3000
FRONTEND_PORT=8080
MYSQL_PORT=3306
```

**Important**: If you change the `BACKEND_PORT`, also update the `VITE_API_BASE_URL` in your `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:YOUR_BACKEND_PORT
```

### Step 2: Start the Application

```bash
docker compose up -d
```

This will start three services:
- **MySQL Database** on port 3306 (or your configured `MYSQL_PORT`)
- **Backend API** on port 3000 (or your configured `BACKEND_PORT`)
- **Frontend Web App** on port 8080 (or your configured `FRONTEND_PORT`)

Access the application at: http://localhost:8080 (or your configured `FRONTEND_PORT`)

## Configuration

### Environment Variables

All configuration is done through environment variables in a `.env` file. The application uses sensible defaults if no `.env` file is provided.

Available environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_ROOT_PASSWORD` | `rustodo_root_password` | MySQL root password |
| `MYSQL_USER` | `rustodo_user` | MySQL application user |
| `MYSQL_PASSWORD` | `rustodo_password` | MySQL application password |
| `BACKEND_PORT` | `3000` | Host port for backend API |
| `FRONTEND_PORT` | `8080` | Host port for frontend web app |
| `MYSQL_PORT` | `3306` | Host port for MySQL database |
| `RUST_LOG` | `info` | Backend logging level (trace, debug, info, warn, error) |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend API URL for frontend |

### Default Credentials

If you don't create a `.env` file, these defaults will be used:
- **Root Password**: `rustodo_root_password`
- **Database**: `rustodo`
- **User**: `rustodo_user`
- **Password**: `rustodo_password`

**⚠️ Security Warning**: Always change the default passwords for production deployments!

## Common Commands

### Start the application
```bash
docker compose up -d
```

### Stop the application
```bash
docker compose down
```

### Stop and remove all data (including database)
```bash
docker compose down -v
```

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Rebuild containers
```bash
docker compose up -d --build
```

### Check service status
```bash
docker compose ps
```

## Using Pre-built Images (Production)

For production deployments, you can use pre-built images from GitHub Container Registry:

1. Download the `compose.prod.yml` file from the latest release
2. Run with the production compose file:

```bash
docker compose -f compose.prod.yml up -d
```

The production images are automatically built and published when a new release is created on GitHub.

## Development

### Local Development with Docker

For development, you can use the local `compose.yml` which builds images from source:

```bash
# Build and start services
docker compose up -d --build

# Make changes to code...

# Rebuild affected service
docker compose up -d --build backend  # or frontend
```

### Building Images Manually

#### Backend
```bash
cd backend
docker build -t rustodo-backend .
```

#### Frontend
```bash
cd frontend
docker build -t rustodo-frontend \
  --build-arg VITE_API_BASE_URL=http://localhost:3000 .
```

## Database

### Database Schema

The database schema is automatically initialized when the MySQL container starts for the first time using the `backend/init.sql` script.

### Accessing the Database

You can connect to the MySQL database using any MySQL client:

```bash
mysql -h 127.0.0.1 -P 3306 -u rustodo_user -p
# Password: rustodo_password (or your custom password)
```

Or using Docker:

```bash
docker compose exec db mysql -u rustodo_user -p rustodo
```

### Backup Database

```bash
docker compose exec db mysqldump -u rustodo_user -p rustodo > backup.sql
```

### Restore Database

```bash
docker compose exec -T db mysql -u rustodo_user -p rustodo < backup.sql
```

## Troubleshooting

### Container won't start

Check the logs:
```bash
docker compose logs
```

### Database connection errors

1. Ensure the database is healthy:
   ```bash
   docker compose ps
   ```
   The `db` service should show `healthy` status.

2. Check the backend environment variables in `compose.yml`

3. Verify the database credentials match between services

### Port already in use

If you see "port already allocated" errors:
1. Check what's using the port: `lsof -i :3000` (or :8080, :3306)
2. Create a `.env` file and change the conflicting port:
   ```bash
   # If backend port 3000 is in use
   BACKEND_PORT=3001
   VITE_API_BASE_URL=http://localhost:3001
   ```
3. Restart the services: `docker compose up -d --build`

### Frontend can't connect to backend

1. Verify the backend is running: `curl http://localhost:3000/listTasks`
2. Check the frontend was built with correct `VITE_API_BASE_URL`
3. Rebuild the frontend if needed:
   ```bash
   docker compose up -d --build frontend
   ```

### Clear all data and start fresh

```bash
docker compose down -v
docker compose up -d
```

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ :8080
       │
┌──────▼──────────┐
│    Frontend     │ (Nginx + React)
│  (Port 80)      │
└──────┬──────────┘
       │ :3000
       │
┌──────▼──────────┐
│    Backend      │ (Rust + Axum)
│  (Port 3000)    │
└──────┬──────────┘
       │ :3306
       │
┌──────▼──────────┐
│     MySQL       │
│  (Port 3306)    │
└─────────────────┘
```

## GitHub Actions

The project includes a GitHub Actions workflow that automatically:
1. Builds Docker images for both backend and frontend
2. Publishes them to GitHub Container Registry
3. Creates a production compose file
4. Attaches the compose file to the release

This happens automatically when you create a new release on GitHub.

### Using Released Images

1. Go to the [Releases page](../../releases)
2. Download the `compose.prod.yml` file from the latest release
3. Run: `docker compose -f compose.prod.yml up -d`

## Security Considerations

For production deployments:

1. **Change default passwords**: Always use strong, unique passwords
2. **Use secrets**: Consider using Docker secrets for sensitive data
3. **Network isolation**: The containers use a dedicated bridge network
4. **HTTPS**: Consider adding a reverse proxy (like Traefik or Nginx) with SSL/TLS
5. **Database access**: Consider not exposing the MySQL port (3306) to the host

## Performance Tips

1. **Resource limits**: Add resource constraints in `compose.yml`:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

2. **Production builds**: The images use multi-stage builds for optimal size
3. **Caching**: Frontend assets are cached with nginx for better performance

## License

See the main [README.md](README.md) for license information.

