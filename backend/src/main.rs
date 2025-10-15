use api::tasks::{add_task, list_tasks, update_task, delete_task};
use axum::{http, routing::{delete, get, post, put}, Router};
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer
};
use tracing::{info};
use std::net::SocketAddr;
use crate::config::env;
use crate::state::app::AppState;

mod api;
mod config;
mod models;
mod repositories;
mod services;
mod state;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let state = env::init().await;

    let cors = CorsLayer::new()
        .allow_methods([http::Method::GET, http::Method::POST, http::Method::PUT, http::Method::DELETE])
        .allow_origin(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/addTask", post(add_task))
        .route("/listTasks", get(list_tasks))
        .route("/updateTask/{ id }", put(update_task))
        .route("/deleteTask", delete(delete_task))
        .with_state(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("Server listening on port 3000!");
    axum::serve(listener, app).await.unwrap();
}
