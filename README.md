# Rustodo

A modern, full-stack todo application built with Rust (backend) and React (frontend).

## Features

- ✅ Create, read, update, and delete tasks
- 🎨 Multiple beautiful themes (Dracula, Gruvbox, Solarized, and more)
- 🔄 Drag-and-drop task reordering
- 🐳 Docker support for easy deployment
- 🚀 Fast and efficient Rust backend
- 📱 Responsive design with Tailwind CSS

## Quick Start with Docker

The easiest way to run Rustodo is using Docker Compose:

```bash
# Optional: Configure environment variables
cp env.example .env
# Edit .env to change passwords and ports if needed

# Start the application
docker compose up -d
```

Then open your browser to http://localhost:8080

**Port Conflicts?** If port 3000 or 8080 is already in use, edit the `.env` file to change `BACKEND_PORT` or `FRONTEND_PORT`.

📖 See [QUICKSTART.md](QUICKSTART.md) for a complete getting started guide  
📚 See [DOCKER.md](DOCKER.md) for detailed Docker documentation

## Development Setup

### Prerequisites

- **Backend**: Rust 1.83+ with Cargo
- **Frontend**: Node.js 22+ and pnpm
- **Database**: MySQL 8.4+

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   cargo build
   ```

2. Set up your database and create a `.env` file:
   ```bash
   DATABASE_URL=mysql://user:password@localhost:3306/rustodo
   RUST_LOG=info
   ```

3. Initialize the database schema:
   ```bash
   mysql -u root -p < init.sql
   ```

4. Run the backend:
   ```bash
   cargo run
   ```

The backend will be available at http://localhost:3000

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

2. Create a `.env` file:
   ```bash
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

The frontend will be available at http://localhost:5173

## Project Structure

```
rustodo/
├── backend/           # Rust backend (Axum)
│   ├── src/
│   │   ├── api/      # API handlers
│   │   ├── config/   # Configuration
│   │   ├── models/   # Data models
│   │   ├── repositories/  # Database layer
│   │   ├── services/ # Business logic
│   │   └── state/    # Application state
│   ├── Dockerfile
│   └── init.sql      # Database schema
│
├── frontend/         # React frontend
│   ├── src/
│   │   ├── api/      # API client
│   │   ├── components/  # React components
│   │   ├── hooks/    # Custom hooks
│   │   ├── layouts/  # Layout components
│   │   └── config/   # Configuration
│   ├── public/
│   │   └── styles/   # Theme CSS files
│   ├── Dockerfile
│   └── nginx.conf
│
├── compose.yml       # Docker Compose configuration
└── DOCKER.md        # Docker documentation
```

## Technology Stack

### Backend
- **Framework**: [Axum](https://github.com/tokio-rs/axum) - Fast, ergonomic web framework
- **Database**: [SQLx](https://github.com/launchbadge/sqlx) - Async SQL toolkit
- **Runtime**: [Tokio](https://tokio.rs/) - Async runtime
- **Serialization**: [Serde](https://serde.rs/) - Serialization framework

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

### Database
- **MySQL 8.4** - Reliable relational database

## API Endpoints

- `POST /addTask` - Create a new task
- `GET /listTasks` - Get all tasks
- `PUT /updateTask/{id}` - Update a task
- `DELETE /deleteTask?id={id}` - Delete a task

## Available Themes

- Modern Dark/Light
- Dracula
- Gruvbox Dark
- Rose Pine Dark
- Solarized Dark
- Scary Monsters
- Malifex

## Docker Deployment

For production deployment using Docker, see our comprehensive [Docker Guide](DOCKER.md).

### Using Pre-built Images

Download the latest `compose.prod.yml` from our [releases page](../../releases) and run:

```bash
docker compose -f compose.prod.yml up -d
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Acknowledgments

Built with ❤️ using Rust and React.

