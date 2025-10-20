# Build stage
FROM rust:slim AS builder

# Install required dependencies for building
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to cache dependencies
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy source code
COPY src ./src

# Copy SQLx offline query data for offline builds
COPY .sqlx ./.sqlx

# Build the actual application with SQLx offline mode
ENV SQLX_OFFLINE=true
RUN touch src/main.rs && cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install required runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/backend /app/backend

# Set environment variables
ENV RUST_LOG=info

# Expose the backend port
EXPOSE 3000

# Run the binary
CMD ["/app/backend"]

