// "use client";

// import React, { useState } from "react";
// import KanbanBoard from "./KanbanBoard";
// import KanbanToggle from "./KanbanToggle";

// const KanbanFeature: React.FC = () => {
//   const [isKanbanOpen, setIsKanbanOpen] = useState(false);

//   return (
//     <>
//       <KanbanToggle onOpen={() => setIsKanbanOpen(true)} />
//       <KanbanBoard isOpen={isKanbanOpen} onClose={() => setIsKanbanOpen(false)} />
//     </>
//   );
// };

// export default KanbanFeature;

// "use client";

// import React, { useState } from "react";
// import KanbanBoard from "./KanbanBoard";
// import KanbanToggle from "./KanbanToggle";

// const KanbanFeature: React.FC = () => {
//   const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);

//   return (
//     <>
//       <KanbanToggle onOpen={setCurrentBoardId} />
//       {currentBoardId && (
//         <KanbanBoard 
//           isOpen={!!currentBoardId} 
//           onClose={() => setCurrentBoardId(null)}
//           boardId={currentBoardId}
//         />
//       )}
//     </>
//   );
// };

// export default KanbanFeature;

"use client";

import React, { useState } from "react";
import KanbanBoard from "./KanbanBoard";
import KanbanToggle from "./KanbanToggle";
import { Id } from "../../../../convex/_generated/dataModel";

const KanbanFeature: React.FC = () => {
  const [currentBoardId, setCurrentBoardId] = useState<Id<"kanbanBoards"> | null>(null);

  return (
    <>
      <KanbanToggle onOpen={setCurrentBoardId} />
      {currentBoardId && (
        <KanbanBoard 
          isOpen={true}
          onClose={() => setCurrentBoardId(null)}
          boardId={currentBoardId}
        />
      )}
    </>
  );
};

export default KanbanFeature;