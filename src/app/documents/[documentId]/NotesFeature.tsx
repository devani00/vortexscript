// "use client";

// import React, { useState } from "react";
// import NotesBoard from "./NotesBoard";
// import NotesToggle from "./NotesToggle";

// const NotesFeature: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <NotesToggle onOpen={() => setIsOpen(true)} />
//       <NotesBoard isOpen={isOpen} onClose={() => setIsOpen(false)} />
//     </>
//   );
// };

// export default NotesFeature;

"use client";

import React, { useState } from "react";
import NotesBoard from "./NotesBoard";
import NotesToggle from "./NotesToggle";

const NotesFeature: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NotesToggle onOpen={() => setIsOpen(true)} />
      <NotesBoard isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default NotesFeature;