import useAxios from './useAxios';
import { ENDPOINTS } from '../config';

interface UpdateTaskData {
  description?: string;
  completed?: number;
}

interface UseUpdateTaskReturn {
  updateTask: (id: string, updateData: UpdateTaskData) => Promise<unknown>;
  loading: boolean;
  error: string | null;
}

const useUpdateTask = (): UseUpdateTaskReturn => {
  const { loading, error, sendRequest } = useAxios();

  const updateTask = async (id: string, updateData: UpdateTaskData): Promise<unknown> => {
    const response = await sendRequest({
      method: 'PUT',
      url: ENDPOINTS.UPDATE_TASK(id),
      headers: {
        'Content-Type': 'application/json',
      },
      data: updateData,
    });
    return response.data;
  };

  return {
    updateTask,
    loading,
    error,
  };
};

export default useUpdateTask;
