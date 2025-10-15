import Action from "../Action/Action";

const ActionMenu = ({setShowAddTask}) => {
    const handleAddTask = () => {
        console.log("Add Task clicked!");
        setShowAddTask(true);
    }

    const handleEditTask = () => {
        console.log("Edit Task clicked!");
    }

    const handleDeleteTask = () => {
        console.log("Delete Task clicked!");
    }

    return (
        <div className="flex flex-col min-w-56  p-4 m-4 justify-center gap-16 bg-surface-panel border border-border">
            <Action action={"Add Task"} command={handleAddTask} />
            <Action action={"Edit Task"} command={handleEditTask} />
            <Action action={"Delete Task"} command={handleDeleteTask} />
        </div>
    )
}

export default ActionMenu
