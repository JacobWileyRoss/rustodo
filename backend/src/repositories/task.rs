use sqlx::{MySql, Pool};
use crate::models::task::{Task, UpdateTaskBody};
use crate::api::errors::AppError;

pub struct TaskRepository {
    pool: Pool<MySql>,
}

impl TaskRepository {
    pub fn new(pool: Pool<MySql>) -> Self {
        Self { pool }
    }

    pub async fn insert_task(&self, id: &str, description: &str, completed: i32) -> Result<(), AppError> {
        sqlx::query!(
            r#"INSERT INTO tasks (id, description, completed) VALUES (?, ?, ?)"#,
            id,
            description,
            completed
        )
        .execute(&self.pool)
        .await
        .map_err(AppError::Database)?;
        Ok(())
    }

    pub async fn fetch_tasks(&self) -> Result<Vec<Task>, AppError> {
        let tasks = sqlx::query_as!(
            Task,
            r#"SELECT id, description, completed, created_at FROM tasks"#
        )
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::Database)?;
        Ok(tasks)
    }

    pub async fn update_task(&self, id: &str, body: UpdateTaskBody) -> Result<Task, AppError> {
        let mut query = String::from("UPDATE tasks SET ");
        let mut set_clauses = Vec::new();
        let mut bind_values: Vec<String> = Vec::new();
        let mut completed_value: Option<i32> = None;

        if let Some(description) = &body.description {
            set_clauses.push("description = ?");
            bind_values.push(description.to_string());
        }
        if let Some(completed) = body.completed {
            set_clauses.push("completed = ?");
            completed_value = Some(completed);
        }

        if set_clauses.is_empty() {
            return Err(AppError::InvalidUpdate);
        }

        query.push_str(&set_clauses.join(", "));
        query.push_str(" WHERE id = ?");

        let mut sqlx_query = sqlx::query(&query);
        for value in &bind_values {
            sqlx_query = sqlx_query.bind(value);
        }
        if let Some(completed) = completed_value {
            sqlx_query = sqlx_query.bind(completed);
        }
        sqlx_query = sqlx_query.bind(id);

        sqlx_query
            .execute(&self.pool)
            .await
            .map_err(AppError::Database)?;

        let task = sqlx::query_as!(
            Task,
            r#"SELECT id, description, completed, created_at FROM tasks WHERE id = ?"#,
            id
        )
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::Database)?;

        Ok(task)
    }

    pub async fn delete_task(&self, id: String) -> Result<(), AppError> {
        sqlx::query!(
            r#"DELETE FROM tasks WHERE id = ?"#,
            id
        )
            .execute(&self.pool)
            .await
            .map_err(AppError::Database)?;
        Ok(())
    }
}
