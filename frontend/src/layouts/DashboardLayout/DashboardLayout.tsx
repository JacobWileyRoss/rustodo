import { useEffect, useState } from "react";
import useGetTasks from "../../api/hooks/useGetTasks";
import TaskList from "../../components/TaskList/TaskList";
import ActionMenu from "../../components/ActionMenu/ActionMenu";
import AddTaskPanel from "../../components/AddTaskPanel/AddTaskPanel";

const DashboardLayout = () => {
    const [tasks, setTasks] = useState(null);
    const [showAddTask, setShowAddTask] = useState(false);


    const { getTasks } = useGetTasks();

    const syncTasks = async () => {
        console.log("syncTasks() called")
        try {
            const response = await getTasks();
            console.log("syncTasks response: ", response);
            setTasks(response);
        } catch (err) {
            console.error("Failed to fetch tasks: ", err);
            setTasks([]);
        }
    }

    useEffect(() => {
        syncTasks();
    }, [])

    return (
        <div className="flex flex-row w-full h-screen">
            <ActionMenu setShowAddTask={setShowAddTask} />
            <TaskList tasks={tasks} />
            {showAddTask && (
                <AddTaskPanel setShowAddTask={setShowAddTask} syncTasks={syncTasks}/>
            )}
        </div>
    )
}

export default DashboardLayout
