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
    documentId: v.id("documents"),
    columns: v.object({
      todo: v.array(
        v.object({
          id: v.string(),
          content: v.string(),
        })
      ),
      inProgress: v.array(
        v.object({
          id: v.string(),
          content: v.string(),
        })
      ),
      review: v.array(
        v.object({
          id: v.string(),
          content: v.string(),
        })
      ),
      done: v.array(
        v.object({
          id: v.string(),
          content: v.string(),
        })
      ),
    }),
  }).index("by_document_id", ["documentId"]),
});
