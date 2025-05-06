// Original antonio strucrture

// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//     documents: defineTable({
//         title: v.string(),
//         initialContent: v.optional(v.string()),
//         ownerId: v.string(),
//         roomId: v.optional(v.string()),
//         organizationId: v.optional(v.string()),
//     })
//         .index("by_owner_id", ["ownerId"])
//         .index("by_organization_id", ["organizationId"])
//         .searchIndex("search_title", {
//             searchField: "title",
//             filterFields: ["ownerId", "organizationId"],
//         }) 
// });

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),

  kanbanBoards: defineTable({
    title: v.string(),
    ownerId: v.string(),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"]),

  kanbanColumns: defineTable({
    boardId: v.id("kanbanBoards"),
    title: v.string(),
    type: v.string(),
    order: v.number(),
  })
    .index("by_board_id", ["boardId"]),

  kanbanTasks: defineTable({
    columnId: v.id("kanbanColumns"),
    boardId: v.id("kanbanBoards"),
    content: v.string(),
    position: v.number(),
    ownerId: v.string(),
  })
    .index("by_column_id", ["columnId"])
    .index("by_board_id", ["boardId"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["boardId", "columnId"],
    }),

  notes: defineTable({
    heading: v.optional(v.string()),
    content: v.string(),
    color: v.string(),
    ownerId: v.string(),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["ownerId", "organizationId"],
    }),
});