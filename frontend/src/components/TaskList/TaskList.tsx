import Task from "../../components/Task/Task";

const TaskList = ({tasks}) => {

    if(!tasks) {
        return <div>No current tasks</div>
    }

    return (
        <div className="flex flex-col w-full p-4 m-4 bg-surface-panel  border border-border">
            <div className="flex text-center py-4 bg-header-bg  border text-2xl font-semibold">
                <div className="w-184">Task</div>
                <div className="w-64">Status</div>
                <div className="w-64">Completed</div>
            </div>
            <div className="flex flex-col flex-1 p-4 m-4 w-full overflow-y-auto space-y-8">
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <div key={index} className="flex w-full">
                            <Task
                                id={task.id}
                                description={task.description}
                                completed={task.completed}
                                createdAt={task.created_at}
                            />
                        </div>
                ))) : (
                        <div>No current tasks</div>
                )}
            </div>
        </div>
    )
}

export default TaskList
