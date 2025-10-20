import { useState, useEffect, useRef } from 'react';
import useUpdateTask from '../../api/hooks/useUpdateTask';

interface EditTaskPanelProps {
  taskId: string;
  initialDescription: string;
  setShowEditTask: (show: boolean) => void;
  syncTasks: () => void;
}

const EditTaskPanel = ({
  taskId,
  initialDescription,
  setShowEditTask,
  syncTasks,
}: EditTaskPanelProps) => {
  const [description, setDescription] = useState(initialDescription);
  const { updateTask } = useUpdateTask();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  useEffect(() => {
    // Focus the textarea and select all text when the component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    await updateTask(taskId, { description: description.trim() });
    setShowEditTask(false);
    syncTasks();
  };

  const handleClose = () => setShowEditTask(false);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 w-full sm:max-w-md bg-surface-panel border-l border-border/40 shadow-xl">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Task</h3>
            <button
              className="text-neutral hover:text-foreground cursor-pointer"
              onClick={handleClose}
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <label className="block text-sm mb-2 text-neutral">Description</label>
            <textarea
              ref={textareaRef}
              className="w-full rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-0 min-h-28"
              placeholder="Edit task description..."
              value={description}
              rows={6}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <p className="mt-2 text-[11px] text-neutral">
              Press Enter to save (Shift + Enter for new line)
            </p>
          </div>

          <div className="px-6 py-4 border-t border-border/40 flex items-center justify-end gap-2">
            <button
              className="rounded-lg border border-border/40 px-4 py-2 text-sm hover:bg-surface-panel cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-primary text-black px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!description.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPanel;
