import { useState } from "react";
import useAddTask from "../../api/hooks/useAddTask";

const AddTaskPanel = ({setShowAddTask, syncTasks}) => {
    const [task, setTask] = useState("Add a new task...");
    const { addTask } = useAddTask();

    const handleFormClick = () => {
        setTask("");
    }
    const handleSubmit = async () => {
        console.log(`Task to add: ${task}`);
        const response = await addTask(task);
        setShowAddTask(false);
        syncTasks();
        setTask("Add a new task...");
    }

    return (
        <div>
            <textarea
                className="text-white"
                value={task}
                rows="3"
                onClick={handleFormClick}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); // Prevent newline
                        handleSubmit();
                    }
                }}
            />
            <button
                className="text-red-500"
                onClick={handleSubmit}
            >
                Add
            </button>
        </div>
    )
}

export default AddTaskPanel
