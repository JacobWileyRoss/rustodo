import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  MeasuringStrategy,
  type Modifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Task from '../Task/Task';
import type { Task as TaskType } from '../../api/hooks/useGetTasks';

interface TaskListProps {
  tasks: TaskType[] | null;
  onReorder?: (tasks: TaskType[]) => void;
  onToggleComplete?: (id: string, currentStatus: number) => void;
  onDeleteSelected?: (ids: string[]) => void;
  selectedTasks?: string[];
  onSelectionChange?: (ids: string[]) => void;
  selectionMode?: boolean;
  onSelectionModeChange?: (mode: boolean) => void;
  onCancelSelection?: () => void;
  onEditTask?: (taskId: string) => void;
}

const TaskList = ({
  tasks,
  onReorder,
  onToggleComplete,
  onDeleteSelected,
  selectedTasks = [],
  onSelectionChange,
  selectionMode = false,
  onSelectionModeChange,
  onCancelSelection,
  onEditTask,
}: TaskListProps) => {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [taskWidth, setTaskWidth] = useState<number>(0);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const cursorOffsetModifier: Modifier = ({ transform }) => {
    return {
      ...transform,
      x: transform.x - 20,
      y: transform.y - 20,
    };
  };

  if (tasks === null) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-surface-panel/60 border border-border/30"
          />
        ))}
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
      const element = document.querySelector(`[data-id="${active.id}"]`) as HTMLElement;
      if (element) {
        setTaskWidth(element.offsetWidth);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      onReorder?.(newTasks);
    }

    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleSelect = (id: string, selected: boolean) => {
    const newSelected = selected
      ? [...selectedTasks, id]
      : selectedTasks.filter((taskId) => taskId !== id);
    onSelectionChange?.(newSelected);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && tasks) {
      onSelectionChange?.(tasks.map((task) => task.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.length > 0) {
      onDeleteSelected?.(selectedTasks);
    }
  };

  const allSelected = tasks && tasks.length > 0 && selectedTasks.length === tasks.length;
  const someSelected = selectedTasks.length > 0 && selectedTasks.length < (tasks?.length || 0);

  return (
    <div className="h-full flex flex-col">
      {tasks && tasks.length > 0 ? (
        <>
          {/* Bulk Actions Bar */}
          {selectionMode ? (
            <div className="mb-4 flex items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border/40 bg-background text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-neutral">
                  {selectedTasks.length > 0
                    ? `${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''} selected`
                    : 'Select all'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedTasks.length === 1 && (
                  <button
                    onClick={() => onEditTask?.(selectedTasks[0])}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-edit hover:bg-edit-hover text-foreground border border-border/40 text-sm font-medium transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                      <path d="m15 5 4 4"></path>
                    </svg>
                    Edit Task
                  </button>
                )}
                {selectedTasks.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-delete/20 hover:bg-delete/30 text-delete border border-delete/30 text-sm font-medium transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                    Delete Selected
                  </button>
                )}
                <button
                  onClick={onCancelSelection}
                  className="px-3 py-1.5 rounded-lg border border-border/40 hover:bg-surface-panel text-neutral text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 flex items-center justify-end px-2">
              <button
                onClick={() => onSelectionModeChange?.(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 hover:bg-surface-panel text-neutral text-sm font-medium transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
                Select Tasks
              </button>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            measuring={measuring}
          >
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-transparent">
                {tasks.map((task) => (
                  <div key={task.id} data-id={task.id}>
                    <Task
                      id={task.id}
                      description={task.description}
                      completed={task.completed}
                      createdAt={task.created_at}
                      isSelected={selectedTasks.includes(task.id)}
                      onToggleComplete={onToggleComplete}
                      onSelect={handleSelect}
                      showCheckbox={selectionMode}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
            <DragOverlay
              modifiers={[cursorOffsetModifier]}
              dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
              }}
            >
              {activeTask ? (
                <div
                  className={`rounded-xl border border-primary/60 bg-surface-task shadow-2xl shadow-primary/20 p-4 cursor-grabbing ${
                    activeTask.completed ? 'opacity-50 grayscale' : ''
                  }`}
                  style={{
                    width: taskWidth > 0 ? `${taskWidth}px` : 'auto',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex items-start gap-3 flex-1">
                      {selectionMode && <div className="w-4 h-4 mt-1.5"></div>}
                      <div className="mt-1 text-primary">
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
                            activeTask.completed ? 'line-through' : ''
                          }`}
                        >
                          {activeTask.description}
                        </p>
                        {activeTask.created_at && (
                          <p className="mt-1 text-xs text-neutral">
                            Created at {activeTask.created_at}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${
                        activeTask.completed
                          ? 'bg-save/15 text-save border-save/30'
                          : 'bg-accent/15 text-accent border-accent/30'
                      }`}
                    >
                      {activeTask.completed ? (
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
                      {activeTask.completed ? 'Completed' : 'Incomplete'}
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      ) : null}
    </div>
  );
};

export default TaskList;
