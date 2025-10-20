import useAxios from './useAxios';
import { ENDPOINTS } from '../config';

export interface Task {
  id: string;
  description: string;
  completed: number;
  created_at: string;
}

interface UseGetTasksReturn {
  getTasks: () => Promise<Task[]>;
  loading: boolean;
  error: string | null;
}

const useGetTasks = (): UseGetTasksReturn => {
  const { loading, error, sendRequest } = useAxios();

  const getTasks = async (): Promise<Task[]> => {
    const response = await sendRequest({
      method: 'GET',
      url: ENDPOINTS.GET_TASKS,
    });
    return response.data.tasks;
  };

  return {
    getTasks,
    loading,
    error,
  };
};

export default useGetTasks;
