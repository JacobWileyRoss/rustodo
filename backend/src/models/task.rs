use serde::{Deserialize, Serialize, Serializer};
use time::{OffsetDateTime, format_description};
use once_cell::sync::Lazy;

#[derive(Serialize)]
pub struct Task {
    pub id: String,
    pub description: String,
    pub completed: i32,
    #[serde(serialize_with = "serialize_datetime")]
    pub created_at: OffsetDateTime,
}

pub static DATE_FORMAT: Lazy<Vec<time::format_description::FormatItem>> = Lazy::new(|| {
    format_description::parse("[year]-[month]-[day] [hour]:[minute]:[second]").unwrap()
});

pub fn serialize_datetime<S>(dt: &OffsetDateTime, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    let formatted = dt.format(&DATE_FORMAT).map_err(serde::ser::Error::custom)?;
    serializer.serialize_str(&formatted)
}

#[derive(Deserialize)]
pub struct AddTaskBody {
    pub task: String,
}

#[derive(Serialize)]
pub struct AddTaskResponse {
    pub message: String,
}

#[derive(Serialize)]
pub struct ListTaskResponse {
    pub tasks: Vec<Task>,
}

#[derive(Deserialize)]
pub struct UpdateTaskBody {
    pub description: Option<String>,
    pub completed: Option<i32>
}

#[derive(Serialize)]
pub struct UpdateTaskResponse {
    pub task: Task,
}

#[derive(Deserialize)]
pub struct DeleteTaskBody {
    pub id: String,
}

#[derive(Serialize)]
pub struct DeleteTaskResponse {
    pub message: String,
}
