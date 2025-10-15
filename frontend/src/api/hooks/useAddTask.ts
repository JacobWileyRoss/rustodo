import useAxios from './useAxios';
import { ENDPOINTS } from '../config';

const useAddTask = () => {
    const { data, loading, error, sendRequest } = useAxios();

    const addTask = async (description) => {
        const response = await sendRequest({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {task: description},
            url: ENDPOINTS.ADD_TASK,
        });
        return response.data.tasks;
    };

    return {
        addTask,
        data,
        loading,
        error
    };
};

export default useAddTask
