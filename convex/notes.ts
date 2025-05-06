import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    heading: v.optional(v.string()),
    content: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const organizationId = user.organization_id ? String(user.organization_id) : undefined;

    return await ctx.db.insert("notes", {
      heading: args.heading,
      content: args.content,
      color: args.color,
      ownerId: user.subject,
      organizationId,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const organizationId = user.organization_id ?? undefined;

    if (organizationId) {
      return await ctx.db
        .query("notes")
        .withIndex("by_organization_id", q => q.eq("organizationId", String(organizationId)))
        .collect();
    }

    return await ctx.db
      .query("notes")
      .withIndex("by_owner_id", q => q.eq("ownerId", user.subject))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    heading: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const note = await ctx.db.get(args.id);
    if (!note) throw new ConvexError("Note not found");

    if (note.ownerId !== user.subject) {
      throw new ConvexError("Only the note owner can update it");
    }

    return await ctx.db.patch(args.id, {
      heading: args.heading,
      content: args.content,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const note = await ctx.db.get(args.id);
    if (!note) throw new ConvexError("Note not found");

    if (note.ownerId !== user.subject) {
      throw new ConvexError("Only the note owner can delete it");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});