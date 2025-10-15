use thiserror::Error;
use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::json;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database error {0}")]
    Database(#[from] sqlx::Error),

    #[error("Invalid task description")]
    InvalidTask,

    #[error("Invalid task id")]
    InvalidId,

    #[error("Invalid  update fields")]
    InvalidUpdate,

    #[error("Internal server error")]
    Internal,
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let (status, message) = match self {
            AppError::Database(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            AppError::InvalidTask => (StatusCode::BAD_REQUEST, "Invalid task description".to_string()),
            AppError::InvalidId => (StatusCode::BAD_REQUEST, "Invalid task id".to_string()),
            AppError::InvalidUpdate => (StatusCode::BAD_REQUEST, "Invalid update fields".to_string()),
            AppError::Internal => (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error".to_string()),
        };

        (status, Json(serde_json::json!({"error": message}))).into_response()
    }
}
