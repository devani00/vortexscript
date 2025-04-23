"use client";

import React from "react";
import { KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanToggleProps {
  onOpen: () => void;
}

const KanbanToggle: React.FC<KanbanToggleProps> = ({ onOpen }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onOpen}
      className="hover:bg-neutral-200/80 rounded-sm"
    >
      <KanbanSquare className="h-5 w-5" />
      <span className="sr-only">Open Kanban Board</span>
    </Button>
  );
};

export default KanbanToggle;
