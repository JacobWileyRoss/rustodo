use sqlx::{mysql::MySqlPoolOptions, MySql, Pool};
use crate::state::app::AppState;

pub async fn init() -> AppState {
    dotenvy::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set!");
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to MySQL");
    AppState { pool }
}
