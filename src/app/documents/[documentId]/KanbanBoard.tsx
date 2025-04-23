"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { Task, ColumnType } from "@/types/kanban";

interface KanbanBoardProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialData: Record<ColumnType, Task[]> = {
  todo: [
    { id: uuidv4(), content: "Setup project" },
    { id: uuidv4(), content: "Design UI" },
  ],
  inProgress: [{ id: uuidv4(), content: "Build Kanban board" }],
  review: [],
  done: [{ id: uuidv4(), content: "Requirement analysis" }],
};

const columnLabels: Record<ColumnType, string> = {
  todo: "Todo",
  inProgress: "In Progress",
  review: "Review",
  done: "Done",
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ isOpen, onClose }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(initialData);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<ColumnType | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDragStart = (task: Task, from: ColumnType) => {
    setDraggingTask(task);
    setDraggingFrom(from);
  };

  const handleDrop = (to: ColumnType) => {
    if (!draggingTask || draggingFrom === null || draggingFrom === to) return;

    setColumns((prev) => {
      const fromTasks = prev[draggingFrom].filter((t) => t.id !== draggingTask.id);
      const toTasks = [...prev[to], { ...draggingTask, isEditing: false }];
      return {
        ...prev,
        [draggingFrom]: fromTasks,
        [to]: toTasks,
      };
    });

    setDraggingTask(null);
    setDraggingFrom(null);
  };

  const handleAddTodo = () => {
    const newTask: Task = { id: uuidv4(), content: "", isEditing: true };
    setColumns((prev) => ({
      ...prev,
      todo: [newTask, ...prev.todo],
    }));
  };

  const handleChangeContent = (id: string, value: string) => {
    setColumns((prev) => ({
      ...prev,
      todo: prev.todo.map((task) =>
        task.id === id ? { ...task, content: value } : task
      ),
    }));
  };

  const handleSave = (id: string) => {
    setColumns((prev) => ({
      ...prev,
      todo: prev.todo
        .map((task) =>
          task.id === id ? { ...task, isEditing: false } : task
        )
        .filter((task) => task.content.trim() !== "")
    }));
  };

  const handleEdit = (id: string) => {
    setColumns((prev) => ({
      ...prev,
      todo: prev.todo.map((task) =>
        task.id === id ? { ...task, isEditing: true } : task
      ),
    }));
  };

  const handleDeleteTask = (col: ColumnType, id: string) => {
    setColumns((prev) => ({
      ...prev,
      [col]: prev[col].filter((task) => task.id !== id),
    }));
  };

  return (
    <div
      ref={boardRef}
      className={cn(
        "fixed top-0 bottom-0 right-0 w-3/4 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold tracking-tight">Kanban Board</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      <div className="p-4 overflow-y-auto h-full">
        <div className="grid grid-cols-4 gap-2 h-full">
          {Object.entries(columns).map(([key, tasks]) => {
            const colKey = key as ColumnType;
            return (
              <div
                key={colKey}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(colKey)}
                className="bg-gray-100 rounded-lg p-3 flex flex-col max-h-[calc(100vh-115px)] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">
                    {columnLabels[colKey]}{" "}
                    <span className="text-sm text-gray-500 font-normal">
                      {tasks.length}
                    </span>
                  </h3>
                  {colKey === "todo" && (
                    <button
                      onClick={handleAddTodo}
                      className="text-gray-500 hover:text-black"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {tasks.map((task) => (
                  <div key={task.id} className="mb-2">
                    {colKey === "todo" && task.isEditing ? (
                      <Input
                        value={task.content}
                        onChange={(e) =>
                          handleChangeContent(task.id, e.target.value)
                        }
                        onBlur={() => handleSave(task.id)}
                        autoFocus
                        placeholder="Enter task..."
                        className="p-2 bg-white rounded shadow"
                      />
                    ) : (
                      <div
                        draggable
                        onDragStart={() => handleDragStart(task, colKey)}
                        className="bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                      >
                        <span
                          onClick={() =>
                            colKey === "todo" && handleEdit(task.id)
                          }
                          className="flex-1"
                        >
                          {task.content}
                        </span>
                        <Trash2
                          className="ml-2 h-4 w-4 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTask(colKey, task.id)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
