use tracing::{debug, error};
use crate::models::task::{AddTaskBody, DeleteTaskBody, DeleteTaskResponse, ListTaskResponse, Task, UpdateTaskBody, UpdateTaskResponse};
use crate::api::errors::AppError;
use crate::repositories::task::TaskRepository;
use uuid::Uuid;

pub struct TaskService;

impl TaskService {
    pub async fn create_task(repo: &TaskRepository, body: AddTaskBody) -> Result<(), AppError> {
        if body.task.is_empty() {
            error!("Invalid task description");
            return Err(AppError::InvalidTask);
        }
        let id = Uuid::new_v4().to_string();
        let completed = 0;
        repo.insert_task(&id, &body.task, completed).await?;
        Ok(())
    }

    pub async fn list_tasks(repo: &TaskRepository) -> Result<ListTaskResponse, AppError> {
        let tasks = repo.fetch_tasks().await?;
        Ok(ListTaskResponse { tasks })
    }

    pub async fn update_task(repo: &TaskRepository, id: &str, body: UpdateTaskBody) -> Result<UpdateTaskResponse, AppError> {
        if body.description.is_none() && body.completed.is_none() {
            error!("Invalid update fields");
            return Err(AppError::InvalidUpdate);
        }
        let task = repo.update_task(id, body).await?;
        Ok(UpdateTaskResponse { task: task })
    }

    pub async fn delete_tasks(repo: &TaskRepository, body: DeleteTaskBody) -> Result<DeleteTaskResponse, AppError> {
        if body.id.is_empty() {
            error!("Invalid task id");
            return Err(AppError::InvalidId);
        }
        repo.delete_task(body.id).await?;
        Ok(DeleteTaskResponse { message: "Task deleted successfully".to_string() })
    }
}
