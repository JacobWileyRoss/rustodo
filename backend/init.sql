-- Initialize the database schema for rustodo
CREATE DATABASE IF NOT EXISTS rustodo;
USE rustodo;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY,
    description TEXT NOT NULL,
    completed TINYINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_created_at ON tasks(created_at);

