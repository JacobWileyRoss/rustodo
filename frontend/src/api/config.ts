export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
    ADD_TASK: `${API_BASE_URL}/addTask`,
    GET_TASKS: `${API_BASE_URL}/listTasks`,
}
