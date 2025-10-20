import useAxios from './useAxios';
import { ENDPOINTS } from '../config';

interface UseDeleteTaskReturn {
  deleteTask: (id: string) => Promise<unknown>;
  loading: boolean;
  error: string | null;
}

const useDeleteTask = (): UseDeleteTaskReturn => {
  const { loading, error, sendRequest } = useAxios();

  const deleteTask = async (id: string): Promise<unknown> => {
    const response = await sendRequest({
      method: 'DELETE',
      url: ENDPOINTS.DELETE_TASK,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id },
    });
    return response.data;
  };

  return {
    deleteTask,
    loading,
    error,
  };
};

export default useDeleteTask;
