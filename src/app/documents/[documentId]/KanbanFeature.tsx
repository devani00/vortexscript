"use client";

import React, { useState } from "react";
import KanbanBoard from "./KanbanBoard";
import KanbanToggle from "./KanbanToggle";

const KanbanFeature: React.FC = () => {
  const [isKanbanOpen, setIsKanbanOpen] = useState(false);

  return (
    <>
      <KanbanToggle onOpen={() => setIsKanbanOpen(true)} />
      <KanbanBoard isOpen={isKanbanOpen} onClose={() => setIsKanbanOpen(false)} />
    </>
  );
};

export default KanbanFeature;
