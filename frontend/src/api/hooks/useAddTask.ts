import useAxios from './useAxios';
import { ENDPOINTS } from '../config';

interface UseAddTaskReturn {
  addTask: (description: string) => Promise<string>;
  loading: boolean;
  error: string | null;
}

const useAddTask = (): UseAddTaskReturn => {
  const { loading, error, sendRequest } = useAxios();

  const addTask = async (description: string): Promise<string> => {
    const response = await sendRequest({
      method: 'POST',
      url: ENDPOINTS.ADD_TASK,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { task: description },
    });
    return response.data.message;
  };

  return {
    addTask,
    loading,
    error,
  };
};

export default useAddTask;
