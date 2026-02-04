import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  tasks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    category: v.string(),
    dueDate: v.number(),
    impact: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical"),
    ),
    status: v.union(v.literal("active"), v.literal("done")),
    createdAt: v.number(),
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_dueDate", ["userId", "dueDate"]),
  activityEvents: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("focus"), v.literal("distraction")),
    label: v.string(),
    minutes: v.number(),
    createdAt: v.number(),
    hourBucket: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),
});
