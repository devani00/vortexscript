"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

const NOTE_COLORS = [
  "bg-yellow-100",
  "bg-green-100",
  "bg-pink-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-orange-100",
];

interface Note {
  id: string;
  heading?: string;
  content: string;
  color: string;
}

interface NotesBoardProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotesBoard: React.FC<NotesBoardProps> = ({ isOpen, onClose }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newHeading, setNewHeading] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedHeading, setEditedHeading] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const editingTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sticky-notes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("sticky-notes", JSON.stringify(notes));
  }, [notes]);

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

  useEffect(() => {
    if (editingTextareaRef.current) {
      autoGrow(editingTextareaRef.current);
    }
  }, [editedContent]);

  const handleAddNote = () => {
    if (!newContent.trim()) return;

    const newNote: Note = {
      id: uuidv4(),
      heading: newHeading.trim() || undefined,
      content: newContent.trim(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    };

    setNotes((prev) => [newNote, ...prev]);
    setNewHeading("");
    setNewContent("");
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditedHeading(note.heading || "");
    setEditedContent(note.content);
  };

  const saveEditedNote = () => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === editingNoteId
          ? {
              ...note,
              heading: editedHeading.trim() || undefined,
              content: editedContent.trim(),
            }
          : note
      )
    );
    setEditingNoteId(null);
    setEditedHeading("");
    setEditedContent("");
  };

  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div
      ref={boardRef}
      className={cn(
        "fixed top-0 bottom-0 left-0 w-full sm:w-1/2 bg-neutral-50 dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-neutral-50 dark:bg-zinc-900 dark:border-zinc-700">
        <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">Notes</h2>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-5 w-5 text-neutral-500 hover:text-red-500 transition-colors duration-200" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {/* Add Note Card */}
        <Card className="bg-white dark:bg-zinc-800 border border-black/10 shadow-md">
          <CardContent className="p-3 space-y-2">
            <Input
              placeholder="Heading (optional)"
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
              className="text-sm"
            />
            <Textarea
              placeholder="Write your note..."
              value={newContent}
              onChange={(e) => {
                setNewContent(e.target.value);
                autoGrow(e.target);
              }}
              className="resize-none text-sm overflow-hidden min-h-[60px]"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddNote}
                variant="ghost"
                size="icon"
                className="text-green-600 hover:text-green-700 transition-colors duration-200"
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {notes.map((note) => {
          const isEditing = editingNoteId === note.id;

          return (
            <Card
              key={note.id}
              className={cn(
                note.color,
                "shadow-lg border border-black/10 relative transition-shadow hover:shadow-xl"
              )}
            >
              <CardContent className="p-3 space-y-2">
                {isEditing ? (
                  <>
                    <Input
                      value={editedHeading}
                      onChange={(e) => setEditedHeading(e.target.value)}
                      className="text-sm"
                    />
                    <Textarea
                      ref={editingTextareaRef}
                      value={editedContent}
                      onChange={(e) => {
                        setEditedContent(e.target.value);
                        autoGrow(e.target);
                      }}
                      className="text-sm resize-none overflow-hidden min-h-[60px]"
                    />
                    <div className="flex gap-1 justify-end">
                      <Button size="icon" variant="ghost" onClick={saveEditedNote}>
                        <Check className="w-4 h-4 text-green-600 hover:text-green-700 transition-colors duration-200" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingNoteId(null)}>
                        <X className="w-4 h-4 text-neutral-500 hover:text-red-500 transition-colors duration-200" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div onClick={() => startEditingNote(note)} className="cursor-pointer space-y-1">
                    {note.heading && <h3 className="font-semibold text-sm">{note.heading}</h3>}
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                )}
                <Button
                  size="icon"
                  variant="link"
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute -top-2 -right-1 text-neutral-500 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default NotesBoard;
