import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getKanbanBoard = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("kanbanBoards")
      .filter((q) => q.eq(q.field("documentId"), args.documentId))
      .first();
  },
});

export const initializeKanbanBoard = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.insert("kanbanBoards", {
      documentId: args.documentId,
      columns: {
        todo: [],
        inProgress: [],
        review: [],
        done: [],
      },
    });
  },
});

export const updateKanbanBoard = mutation({
  args: {
    boardId: v.id("kanbanBoards"),
    columns: v.object({
      todo: v.array(v.object({ id: v.string(), content: v.string() })),
      inProgress: v.array(v.object({ id: v.string(), content: v.string() })),
      review: v.array(v.object({ id: v.string(), content: v.string() })),
      done: v.array(v.object({ id: v.string(), content: v.string() })),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.boardId, { columns: args.columns });
  },
});
