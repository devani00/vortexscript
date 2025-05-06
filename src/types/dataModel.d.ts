/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Infer, Schema } from "convex/schema";
import schema from "../schema";

type Schema = typeof schema;

type Documents = Infer<Schema["documents"]>;
type KanbanBoards = Infer<Schema["kanbanBoards"]>;
type KanbanColumns = Infer<Schema["kanbanColumns"]>;
type KanbanTasks = Infer<Schema["kanbanTasks"]>;

declare module "../../convex/_generated/dataModel" {
  interface Document extends Documents {}
  interface KanbanBoard extends KanbanBoards {}
  interface KanbanColumn extends KanbanColumns {}
  interface KanbanTask extends KanbanTasks {}
}