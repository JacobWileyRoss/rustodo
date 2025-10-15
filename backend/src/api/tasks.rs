use axum::http::response;
use axum::{extract::{State, Path}, Json };
use crate::models::task::{AddTaskBody, AddTaskResponse, DeleteTaskBody, DeleteTaskResponse, ListTaskResponse, UpdateTaskBody, UpdateTaskResponse};
use crate::services::task::TaskService;
use crate::repositories::task::TaskRepository;
use crate::state::app::AppState;
use crate::api::errors::AppError;

pub async fn add_task(State(state): State<AppState>, Json(body): Json<AddTaskBody>) -> Result<Json<AddTaskResponse>, AppError> {
    let repo = TaskRepository::new(state.pool);
    TaskService::create_task(&repo, body).await?;
    Ok(Json(AddTaskResponse { message: "Task added successfully".to_string() }))
}

pub async fn list_tasks(State(state): State<AppState>) -> Result<Json<ListTaskResponse>, AppError> {
    let repo = TaskRepository::new(state.pool);
    let response = TaskService::list_tasks(&repo).await?;
    Ok(Json(response))
}

pub async fn update_task(State(state): State<AppState>, Path(id): Path<String>, Json(body): Json<UpdateTaskBody>) -> Result<Json<UpdateTaskResponse>, AppError> {
    let repo = TaskRepository::new(state.pool);
    let response = TaskService::update_task(&repo, &id, body).await?;
    Ok(Json(response))
}

pub async fn delete_task(State(state): State<AppState>, Json(body): Json<DeleteTaskBody>) -> Result<Json<DeleteTaskResponse>, AppError> {
    let repo = TaskRepository::new(state.pool);
    let response = TaskService::delete_tasks(&repo, body).await?;
    Ok(Json(response))
}
