const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  ADD_TASK: `${API_BASE_URL}/addTask`,
  GET_TASKS: `${API_BASE_URL}/listTasks`,
  UPDATE_TASK: (id: string) => `${API_BASE_URL}/updateTask/${id}`,
  DELETE_TASK: `${API_BASE_URL}/deleteTask`,
} as const;
