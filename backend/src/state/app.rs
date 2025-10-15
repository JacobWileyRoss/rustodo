use sqlx::{MySql, Pool};

#[derive(Clone)]
pub struct AppState {
    pub pool: Pool<MySql>,
}
