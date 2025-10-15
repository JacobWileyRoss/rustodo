import useAxios from './useAxios';
import { ENDPOINTS } from '../config';

const useGetTasks = () => {
    const { data, loading, error, sendRequest } = useAxios();

    const getTasks = async () => {
        const response = await sendRequest({
            method: 'GET',
            url: ENDPOINTS.GET_TASKS,
        });
        return response.data.tasks;
    };

    return {
        getTasks,
        data,
        loading,
        error
    };
};

export default useGetTasks
