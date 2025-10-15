const Task = ({id, description, completed, createdAt}) => {
    const Status = {
        0: "Incomplete",
        1: "Completed"
    }

    return (
        <div className="flex flex-row w-full h-24 gap-4 p-2 text-lg font-jetbrains bg-surface-task border border-border hover:cursor-pointer">
            <div className="flex min-w-0 w-184 overflow-y-auto">
                <p className="text-left break-words">{description}</p>
            </div>
            <div className="w-64">
                <p className="text-left">{Status[completed] || "Unknown Status"}</p>
            </div>
            <div className="w-64">
                <p className="text-left">{createdAt}</p>
            </div>
        </div>
    );
}

export default Task
