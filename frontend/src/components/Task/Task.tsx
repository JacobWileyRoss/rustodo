import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskProps {
  id: string;
  description: string;
  completed: number;
  createdAt: string;
  isSelected?: boolean;
  onToggleComplete?: (id: string, currentStatus: number) => void;
  onSelect?: (id: string, selected: boolean) => void;
  showCheckbox?: boolean;
}

const Task = ({
  id,
  description,
  completed,
  createdAt,
  isSelected = false,
  onToggleComplete,
  onSelect,
  showCheckbox = false,
}: TaskProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusLabel = completed ? 'Completed' : 'Incomplete';
  const statusClass = completed
    ? 'bg-save/15 text-save border-save/30 hover:bg-save/25 hover:border-save/50'
    : 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/25 hover:border-accent/50';

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.(id, completed);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect?.(id, e.target.checked);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-sortable-id={id}
      className={`task-item group w-full rounded-xl border ${
        isDragging
          ? 'shadow-2xl shadow-primary/20 border-primary/60 cursor-grabbing opacity-50 bg-surface-task z-50'
          : 'opacity-100 transition-all duration-200'
      } ${
        isSelected
          ? 'border-primary/60 bg-surface-task shadow-lg shadow-primary/10'
          : completed
          ? 'border-border/20 bg-surface-panel/80'
          : 'border-border/30 bg-surface-task/60 hover:border-border/60 hover:bg-surface-task'
      } ${completed ? 'opacity-20 grayscale' : ''} p-4`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex items-start gap-3 flex-1">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleSelectChange}
              onClick={(e) => e.stopPropagation()}
              className="mt-1.5 w-4 h-4 rounded border-border/40 bg-background text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
            />
          )}
          <div
            {...attributes}
            {...listeners}
            className="mt-1 text-neutral/40 group-hover:text-neutral/80 transition-colors cursor-grab active:cursor-grabbing"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
          <div className="min-w-0">
            <p
              className={`font-medium text-foreground break-words ${
                completed ? 'line-through' : ''
              }`}
            >
              {description}
            </p>
            {createdAt && (
              <p className="mt-1 text-xs text-neutral">Created at {createdAt}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleToggleComplete}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:scale-110 cursor-pointer shadow-sm hover:shadow-md ${statusClass}`}
          title={completed ? 'Click to mark as incomplete' : 'Click to mark as complete'}
        >
          {completed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          )}
          {statusLabel}
        </button>
      </div>
    </div>
  );
};

export default Task;
