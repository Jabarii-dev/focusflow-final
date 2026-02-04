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
  status: "active" | "done";
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
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    const id = await ctx.db.insert("tasks", {
      userId,
      title: args.title.trim() || "Untitled",
      category: args.category.trim() || "General",
      dueDate: args.dueDate,
      impact: args.impact,
      status: "active",
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
      throw new Error("Not authenticated");
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

export const listActiveTasks = query({
  args: {},
  handler: async (ctx): Promise<TaskSummary[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
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
