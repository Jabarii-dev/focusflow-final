import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

const impactValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("critical"),
);

type TaskSummary = {
  id: Id<"tasks">;
  title: string;
  category: string;
  dueDate: number;
  impact: "low" | "medium" | "high" | "critical";
  status: "active" | "done" | "overdue";
  createdAt: number;
};

export const createTask = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    dueDate: v.number(),
    impact: impactValidator,
  },
  handler: async (ctx, args): Promise<Id<"tasks">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const now = Date.now();
    const id = await ctx.db.insert("tasks", {
      userId,
      title: args.title.trim() || "Untitled",
      category: args.category.trim() || "General",
      dueDate: args.dueDate,
      impact: args.impact,
      status: "active",
      resolution: null,
      createdAt: now,
    });

    return id;
  },
});

export const completeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args): Promise<Id<"tasks">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found");
    }

    if (task.status === "done") {
      return task._id;
    }

    await ctx.db.patch(args.taskId, { status: "done" });
    return task._id;
  },
});

export const resolveTask = mutation({
  args: {
    id: v.id("tasks"),
    resolution: v.union(v.literal("completed"), v.literal("not_completed")),
  },
  handler: async (ctx, args): Promise<Id<"tasks">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const task = await ctx.db.get(args.id);
    if (!task || task.userId !== userId) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(args.id, {
      status: args.resolution === "completed" ? "done" : "overdue",
      resolution: args.resolution,
    });

    return args.id;
  },
});

export const listOverdueTasks = query({
  args: {},
  handler: async (ctx): Promise<TaskSummary[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const now = Date.now();
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_userId_status_dueDate", (q) =>
        q.eq("userId", userId).eq("status", "active").lt("dueDate", now),
      )
      .collect();

    return tasks
      .map((task) => ({
        id: task._id as Id<"tasks">,
        title: task.title,
        category: task.category,
        dueDate: task.dueDate,
        impact: task.impact,
        status: task.status,
        createdAt: task.createdAt,
      }))
      .sort((a, b) => a.dueDate - b.dueDate);
  },
});

export const listActiveTasks = query({
  args: {},
  handler: async (ctx): Promise<TaskSummary[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "active"),
      )
      .collect();

    return tasks
      .map((task) => ({
        id: task._id as Id<"tasks">,
        title: task.title,
        category: task.category,
        dueDate: task.dueDate,
        impact: task.impact,
        status: task.status,
        createdAt: task.createdAt,
      }))
      .sort((a, b) => a.dueDate - b.dueDate);
  },
});
