// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Plus, Trash2, Pencil, X } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { toast } from "sonner";

// interface KanbanBoardProps {
//   isOpen: boolean;
//   onClose: () => void;
//   documentId: Id<"documents">;
// }

// const KanbanBoard: React.FC<KanbanBoardProps> = ({ isOpen, onClose, documentId }) => {
//   const boardRef = useRef<HTMLDivElement>(null);
//   const boardData = useQuery(api.kanban.getBoard, { documentId });

//   const createTask = useMutation(api.kanban.createTask);
//   const updateTask = useMutation(api.kanban.updateTask);
//   const moveTask = useMutation(api.kanban.moveTask);
//   const deleteTask = useMutation(api.kanban.deleteTask);

//   const [draggingTask, setDraggingTask] = useState<Id<"kanbanTasks"> | null>(null);
//   const [dragOverCol, setDragOverCol] = useState<Id<"kanbanColumns"> | null>(null);
//   const [editingTask, setEditingTask] = useState<{
//     taskId: Id<"kanbanTasks">;
//     content: string;
//   } | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const handleDragStart = (taskId: Id<"kanbanTasks">) => {
//     setDraggingTask(taskId);
//   };

//   const handleDrop = (columnId: Id<"kanbanColumns">) => {
//     if (!draggingTask || !boardData) return;

//     moveTask({
//       taskId: draggingTask,
//       newColumnId: columnId,
//       newPosition: 0,
//     })
//       .catch(() => toast.error("Failed to move task"))
//       .finally(() => {
//         setDraggingTask(null);
//         setDragOverCol(null);
//       });
//   };

//   const handleAddTask = (columnId: Id<"kanbanColumns">) => {
//     if (!boardData?._id) return;
//     createTask({
//       boardId: boardData._id,
//       columnId,
//       content: "New task",
//     }).catch(() => toast.error("Failed to create task"));
//   };

//   const handleEditStart = (taskId: Id<"kanbanTasks">, content: string) => {
//     setEditingTask({ taskId, content });
//   };

//   const handleEditSave = () => {
//     if (!editingTask) return;

//     updateTask({
//       taskId: editingTask.taskId,
//       content: editingTask.content,
//     })
//       .then(() => setEditingTask(null))
//       .catch(() => toast.error("Failed to update task"));
//   };

//   const handleDeleteTask = (taskId: Id<"kanbanTasks">) => {
//     deleteTask({ taskId })
//       .then(() => toast.success("Task deleted"))
//       .catch(() => toast.error("Failed to delete task"));
//   };

//   if (!boardData) return null;

//   return (
//     <div
//       ref={boardRef}
//       className={cn(
//         "fixed top-0 bottom-0 right-0 w-full sm:w-3/4 bg-white dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto",
//         isOpen ? "translate-x-0" : "translate-x-full"
//       )}
//     >
//       <div className="p-6 flex justify-between items-center border-b">
//         <h2 className="text-xl font-semibold tracking-tight">
//           {boardData.title}
//         </h2>
//         <Button variant="ghost" size="icon" onClick={onClose}>
//           <X className="w-5 h-5" />
//         </Button>
//       </div>

//       <div className="p-4 overflow-y-auto h-full">
//         <div className="grid grid-cols-4 gap-3 h-full">
//           {boardData.columns.map((column) => (
//             <div
//               key={column._id}
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 setDragOverCol(column._id);
//               }}
//               onDragLeave={() => setDragOverCol(null)}
//               onDrop={() => handleDrop(column._id)}
//               className={cn(
//                 "rounded-lg p-3 flex flex-col max-h-[calc(100vh-115px)] overflow-y-auto transition-all",
//                 dragOverCol === column._id ? "bg-neutral-200 border-2 border-neutral-950" : "bg-gray-100"
//               )}
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="font-semibold">
//                   {column.title}{" "}
//                   <span className="text-sm text-gray-500 font-normal">
//                     {column.tasks.length}
//                   </span>
//                 </h3>
//                 <button
//                   onClick={() => handleAddTask(column._id)}
//                   className="text-gray-500 hover:text-black"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               {column.tasks.map((task) => (
//                 <div key={task._id} className="mb-2 group">
//                   {editingTask?.taskId === task._id ? (
//                     <textarea
//                       value={editingTask.content}
//                       onChange={(e) => setEditingTask({
//                         ...editingTask,
//                         content: e.target.value,
//                       })}
//                       onBlur={handleEditSave}
//                       autoFocus
//                       className="w-full p-2 bg-white rounded shadow resize-none overflow-hidden min-h-[40px]"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           handleEditSave();
//                         } else if (e.key === "Escape") {
//                           setEditingTask(null);
//                         }
//                       }}
//                     />
//                   ) : (
//                     <div
//                       draggable
//                       onDragStart={() => handleDragStart(task._id)}
//                       className="bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50 flex justify-between items-start gap-2 relative"
//                     >
//                       <span
//                         onClick={() => handleEditStart(task._id, task.content)}
//                         className="flex-1 whitespace-pre-wrap break-words"
//                       >
//                         {task.content}
//                       </span>
//                       <div className="flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Trash2
//                           className="h-4 w-4 text-red-500 hover:text-red-700"
//                           onClick={() => handleDeleteTask(task._id)}
//                         />
//                         <Pencil
//                           className="h-4 w-4 text-blue-500 hover:text-blue-700"
//                           onClick={() => handleEditStart(task._id, task.content)}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KanbanBoard;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil, X, Save, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface KanbanBoardProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: Id<"documents">;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ isOpen, onClose, documentId }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const boardData = useQuery(api.kanban.getBoard, { documentId });

  const createTask = useMutation(api.kanban.createTask);
  const updateTask = useMutation(api.kanban.updateTask);
  const moveTask = useMutation(api.kanban.moveTask);
  const deleteTask = useMutation(api.kanban.deleteTask);

  const [draggingTask, setDraggingTask] = useState<Id<"kanbanTasks"> | null>(null);
  const [dragOverCol, setDragOverCol] = useState<Id<"kanbanColumns"> | null>(null);
  const [editingTask, setEditingTask] = useState<{
    taskId: Id<"kanbanTasks">;
    content: string;
  } | null>(null);

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

  // Adjust textarea height when editing starts or content changes
  useEffect(() => {
    if (editingTask && textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [editingTask]);

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleDragStart = (taskId: Id<"kanbanTasks">) => {
    setDraggingTask(taskId);
  };

  const handleDrop = (columnId: Id<"kanbanColumns">) => {
    if (!draggingTask || !boardData) return;

    moveTask({
      taskId: draggingTask,
      newColumnId: columnId,
      newPosition: 0,
    })
      .catch(() => toast.error("Failed to move task"))
      .finally(() => {
        setDraggingTask(null);
        setDragOverCol(null);
      });
  };

  const handleAddTask = (columnId: Id<"kanbanColumns">) => {
    if (!boardData?._id) return;
    // Only allow adding tasks to the first column (To Do)
    const toDoColumn = boardData.columns[0];
    if (columnId !== toDoColumn._id) {
      toast.error("Tasks can only be added to the To Do column");
      return;
    }
    
    createTask({
      boardId: boardData._id,
      columnId,
      content: "New task",
    }).catch(() => toast.error("Failed to create task"));
  };

  const handleEditStart = (taskId: Id<"kanbanTasks">, content: string) => {
    setEditingTask({ taskId, content });
  };

  const handleEditSave = () => {
    if (!editingTask) return;

    updateTask({
      taskId: editingTask.taskId,
      content: editingTask.content,
    })
      .then(() => setEditingTask(null))
      .catch(() => toast.error("Failed to update task"));
  };

  const handleEditCancel = () => {
    setEditingTask(null);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!editingTask) return;
    
    setEditingTask({
      ...editingTask,
      content: e.target.value,
    });
    
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  };

  const handleDeleteTask = (taskId: Id<"kanbanTasks">) => {
    deleteTask({ taskId })
      .then(() => toast.success("Task deleted"))
      .catch(() => toast.error("Failed to delete task"));
  };

  if (!boardData) return null;

  return (
    <div
      ref={boardRef}
      className={cn(
        "fixed top-0 bottom-0 right-0 w-full sm:w-3/4 bg-white dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold tracking-tight">
          {boardData.title}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 overflow-y-auto h-full">
        <div className="grid grid-cols-4 gap-3 h-full">
          {boardData.columns.map((column) => (
            <div
              key={column._id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(column._id);
              }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={() => handleDrop(column._id)}
              className={cn(
                "rounded-lg p-3 flex flex-col max-h-[calc(100vh-115px)] overflow-y-auto transition-all",
                dragOverCol === column._id ? "bg-neutral-200 border-2 border-neutral-950" : "bg-gray-100"
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">
                  {column.title}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    {column.tasks.length}
                  </span>
                </h3>
                {column._id === boardData.columns[0]._id && (
                  <button
                    onClick={() => handleAddTask(column._id)}
                    className="text-gray-500 hover:text-black"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>

              {column.tasks.map((task) => (
                <div key={task._id} className="mb-2 group">
                  {editingTask?.taskId === task._id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        ref={textareaRef}
                        value={editingTask.content}
                        onChange={handleContentChange}
                        className="w-full p-2 bg-white rounded shadow resize-none overflow-hidden"
                        style={{
                          minHeight: '40px',
                          maxHeight: '300px'
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditCancel}
                          className="h-8 px-2"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleEditSave}
                          className="h-8 px-2"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      draggable
                      onDragStart={() => handleDragStart(task._id)}
                      className="bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50 flex justify-between items-start gap-2 relative"
                    >
                      <span
                        onClick={() => handleEditStart(task._id, task.content)}
                        className="flex-1 whitespace-pre-wrap break-words"
                      >
                        {task.content}
                      </span>
                      <div className="flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2
                          className="h-4 w-4 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTask(task._id)}
                        />
                        <Pencil
                          className="h-4 w-4 text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditStart(task._id, task.content)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;