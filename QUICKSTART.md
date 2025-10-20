# Rustodo Quick Start Guide

## For End Users

### Prerequisites
- Docker (version 24.0+)
- Docker Compose (version 2.0+)

### Installation

1. **Clone or download this repository**

2. **Optional: Configure settings**
   ```bash
   cp env.example .env
   # Edit .env if you want to change passwords or ports
   ```

3. **Start the application**
   ```bash
   docker compose up -d
   ```

4. **Access the app**
   - Open your browser to: http://localhost:8080
   - Backend API: http://localhost:3000

That's it! 🎉

### Common Issues

**Port already in use?**
```bash
# Edit .env file
BACKEND_PORT=3001  # Change to any available port
VITE_API_BASE_URL=http://localhost:3001  # Update this too!
FRONTEND_PORT=8081

# Restart
docker compose down
docker compose up -d --build
```

**Want to reset everything?**
```bash
docker compose down -v  # This will delete all data
docker compose up -d
```

---

## For Developers

### Local Development (With Docker)

The fastest way to develop is using Docker Compose:

```bash
# Start services
docker compose up -d

# Watch logs
docker compose logs -f backend

# Rebuild after code changes
docker compose up -d --build backend  # or frontend
```

### Local Development (Without Docker)

**Backend:**
```bash
cd backend

# Start MySQL (use Docker for just the database)
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=rustodo \
  -e MYSQL_USER=rustodo_user \
  -e MYSQL_PASSWORD=rustodo_password \
  mysql:8.4

# Wait for MySQL to be ready (about 15 seconds)
sleep 15

# Initialize database
mysql -h 127.0.0.1 -u root -proot < init.sql

# Create .env
echo "DATABASE_URL=mysql://rustodo_user:rustodo_password@localhost:3306/rustodo" > .env
echo "RUST_LOG=info" >> .env

# Run backend
cargo run
```

**Frontend:**
```bash
cd frontend

# Create .env
echo "VITE_API_BASE_URL=http://localhost:3000" > .env

# Install dependencies
pnpm install

# Run dev server
pnpm dev
```

### Updating SQLx Queries

If you modify any SQL queries in the code, you need to regenerate the offline query cache:

```bash
cd backend

# Make sure database is running
docker compose up -d db

# Wait for it to be healthy
sleep 15

# Regenerate cache
cargo sqlx prepare --database-url "mysql://rustodo_user:rustodo_password@localhost:3306/rustodo"

# Commit the updated .sqlx directory
git add .sqlx
git commit -m "Update SQLx query cache"
```

### Building for Production

**Local build:**
```bash
# Build both images
docker compose build

# Or build individually
docker compose build backend
docker compose build frontend
```

**GitHub Actions build:**
When you create a release on GitHub:
1. Go to Releases → Create new release
2. Choose a tag (e.g., v1.0.0)
3. Publish the release
4. GitHub Actions will automatically build and publish containers to ghcr.io

### Project Structure

```
rustodo/
├── backend/              # Rust backend
│   ├── .sqlx/           # SQLx offline query cache (committed)
│   ├── src/
│   ├── Dockerfile       # Multi-stage Rust build
│   └── init.sql         # Database schema
├── frontend/            # React frontend
│   ├── src/
│   ├── Dockerfile       # Multi-stage Node + nginx
│   └── nginx.conf       # Production server config
├── compose.yml          # Development compose file
├── env.example          # Environment variable template
└── DOCKER.md           # Detailed Docker documentation
```

### Useful Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Restart a service
docker compose restart backend

# Rebuild and restart
docker compose up -d --build backend

# Execute commands in containers
docker compose exec backend /bin/sh
docker compose exec db mysql -u rustodo_user -p rustodo

# Stop everything
docker compose down

# Stop and remove volumes (deletes all data)
docker compose down -v

# View running containers
docker compose ps

# Check resource usage
docker stats
```

### Testing the API

```bash
# List tasks
curl http://localhost:3000/listTasks

# Add a task
curl -X POST http://localhost:3000/addTask \
  -H "Content-Type: application/json" \
  -d '{"description": "Test task"}'

# Update a task
curl -X PUT http://localhost:3000/updateTask/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed": 1}'

# Delete a task
curl -X DELETE "http://localhost:3000/deleteTask?id={id}"
```

### Port Configuration

Default ports:
- **Frontend**: 8080
- **Backend**: 3000  
- **MySQL**: 3306

To change ports, edit `.env`:
```bash
FRONTEND_PORT=8081
BACKEND_PORT=3001
MYSQL_PORT=3307

# Important: Also update the API URL!
VITE_API_BASE_URL=http://localhost:3001
```

### Database Access

```bash
# Using Docker
docker compose exec db mysql -u rustodo_user -p rustodo
# Password: rustodo_password (or your custom password)

# From host machine
mysql -h 127.0.0.1 -P 3306 -u rustodo_user -p rustodo
```

### Troubleshooting

**Backend won't start:**
```bash
# Check logs
docker compose logs backend

# Common issues:
# 1. Database not ready - wait a bit longer
# 2. Port conflict - change BACKEND_PORT in .env
# 3. SQLx cache out of date - regenerate it
```

**Frontend can't connect to backend:**
```bash
# Verify backend is running
curl http://localhost:3000/listTasks

# If port changed, rebuild frontend with new API URL
# Edit .env to set VITE_API_BASE_URL
docker compose up -d --build frontend
```

**Database connection errors:**
```bash
# Check database is healthy
docker compose ps

# Reset database
docker compose down -v
docker compose up -d
```

### Performance Tips

1. **Use build cache:** Docker caches layers, so rebuilds are fast
2. **Development:** Keep containers running and only rebuild when needed
3. **Production:** Use pre-built images from ghcr.io
4. **Resource limits:** Add to compose.yml if needed:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

## Next Steps

- Read [DOCKER.md](DOCKER.md) for comprehensive Docker documentation
- Check [README.md](README.md) for project overview
- View `.github/workflows/release.yml` for CI/CD setup

## Support

For issues or questions, please open an issue on GitHub.

