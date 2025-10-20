import { useEffect, useState } from 'react';
import useGetTasks, { type Task } from '../../api/hooks/useGetTasks';
import useUpdateTask from '../../api/hooks/useUpdateTask';
import useDeleteTask from '../../api/hooks/useDeleteTask';
import TaskList from '../../components/TaskList/TaskList';
import AddTaskPanel from '../../components/AddTaskPanel/AddTaskPanel';
import EditTaskPanel from '../../components/EditTaskPanel/EditTaskPanel';
import ThemeSelector from '../../components/ThemeSelector/ThemeSelector';
import { useTheme } from '../../hooks/useTheme';

const DashboardLayout = () => {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const { getTasks } = useGetTasks();
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();

  useTheme();

  const syncTasks = async () => {
    try {
      const response = await getTasks();
      const sortedTasks = response
        ? [...response].sort((a, b) => a.completed - b.completed)
        : [];
      setTasks(sortedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    }
  };

  const handleReorder = (reorderedTasks: Task[]) => {
    const sortedTasks = [...reorderedTasks].sort((a, b) => a.completed - b.completed);
    setTasks(sortedTasks);
  };

  const handleToggleComplete = async (id: string, currentStatus: number) => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      await updateTask(id, { completed: newStatus });
      await syncTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await deleteTask(id);
      }
      setSelectedTasks([]);
      setSelectionMode(false);
      await syncTasks();
    } catch (err) {
      console.error('Failed to delete tasks:', err);
    }
  };

  const handleCancelSelection = () => {
    setSelectedTasks([]);
    setSelectionMode(false);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleCloseEditPanel = () => {
    setEditingTaskId(null);
    setSelectedTasks([]);
    setSelectionMode(false);
  };

  const editingTask = tasks?.find((task) => task.id === editingTaskId);

  useEffect(() => {
    syncTasks();
  }, []);

  const incompleteTasks = tasks?.filter((task) => !task.completed) || [];
  const completedTasks = tasks?.filter((task) => task.completed) || [];

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex-none z-20 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">rustodo</h1>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-xs md:text-sm text-neutral">{incompleteTasks.length} active</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2 h-2 rounded-full bg-save"></div>
                <span className="text-xs md:text-sm text-neutral">{completedTasks.length} completed</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeSelector />
              <button
                onClick={() => setShowAddTask(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-black px-4 py-2 text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-primary/25 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full overflow-hidden">
          {tasks && tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to rustodo</h2>
              <p className="text-neutral text-center max-w-md mb-8">
                Get started by creating your first task. Stay organized and productive!
              </p>
              <button
                onClick={() => setShowAddTask(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-black px-6 py-3 font-semibold transition-all hover:scale-105 shadow-lg shadow-primary/25 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col overflow-hidden">
              {/* Task List Card */}
              <div className="bg-surface-panel/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-xl flex-1 min-h-0 overflow-hidden">
                <div className="p-6 h-full overflow-hidden">
                  <TaskList
                    tasks={tasks}
                    onReorder={handleReorder}
                    onToggleComplete={handleToggleComplete}
                    onDeleteSelected={handleDeleteSelected}
                    selectedTasks={selectedTasks}
                    onSelectionChange={setSelectedTasks}
                    selectionMode={selectionMode}
                    onSelectionModeChange={setSelectionMode}
                    onCancelSelection={handleCancelSelection}
                    onEditTask={handleEditTask}
                  />
                </div>
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-center gap-2 text-xs text-neutral/60 mt-6">
                <span>Total: {tasks?.length || 0} tasks</span>
                <span>•</span>
                <span>{incompleteTasks.length} pending</span>
                <span>•</span>
                <span>{completedTasks.length} done</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Slide-over for Add Task */}
      {showAddTask && (
        <AddTaskPanel setShowAddTask={setShowAddTask} syncTasks={syncTasks} />
      )}

      {/* Slide-over for Edit Task */}
      {editingTaskId && editingTask && (
        <EditTaskPanel
          taskId={editingTaskId}
          initialDescription={editingTask.description}
          setShowEditTask={(show) => {
            if (!show) handleCloseEditPanel();
          }}
          syncTasks={syncTasks}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
