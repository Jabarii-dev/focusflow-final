import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

type StatCounts = {
  focusCount: number;
  distractionCount: number;
  focusMinutes: number;
  distractionMinutes: number;
  totalMinutes: number;
};

type DelayPattern = {
  category: string;
  avgDelayDays: number;
};

type ActiveTaskSummary = {
  id: Id<"tasks">;
  title: string;
  category: string;
  dueDate: number;
  impact: "low" | "medium" | "high" | "critical";
  status: "active" | "done" | "overdue";
  createdAt: number;
};

type DelayCategoryTotals = {
  totalDelayDays: number;
  count: number;
};

type TopDistraction = {
  label: string;
  minutes: number;
};

type TrendDirection = "up" | "down" | "flat";

type StatsSummary = {
  topDistraction: string | null;
  topDistractions: TopDistraction[];
  topDistractionTrend: TrendDirection;
  peakHours: number[];
  peakHoursTrend: TrendDirection;
  streakImpact: string;
  systemStatus: "stable" | "warning" | "critical";
  analyzingLabel: string;
  counts: StatCounts;
  focusScore: number;
  completedSessions: number;
  avgSessionMinutes: number;
  distractions: number;
  delayPatterns: DelayPattern[];
  activeTasks: ActiveTaskSummary[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const getHourBucket = (timestamp: number) =>
  Math.floor(timestamp / HOUR_MS) % 24;

const getTrendDirection = (current: number, previous: number): TrendDirection => {
  if (current > previous) {
    return "up";
  }
  if (current < previous) {
    return "down";
  }
  return "flat";
};

export const logEvent = mutation({
  args: {
    type: v.union(v.literal("focus"), v.literal("distraction")),
    label: v.string(),
    minutes: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"activityEvents">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const now = Date.now();
    const hourBucket = getHourBucket(now);
    const id = await ctx.db.insert("activityEvents", {
      userId,
      type: args.type,
      label: args.label.trim() || "Untitled",
      minutes: args.minutes,
      createdAt: now,
      updatedAt: now,
      hourBucket,
    });
    return id;
  },
});

export const updateActivity = mutation({
  args: {
    id: v.id("activityEvents"),
    label: v.string(),
    minutes: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"activityEvents">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const event = await ctx.db.get(args.id);
    if (!event || event.userId !== userId) {
      throw new Error("Activity not found");
    }

    const updatedAt = Date.now();
    await ctx.db.patch(args.id, {
      label: args.label.trim() || "Untitled",
      minutes: args.minutes,
      updatedAt,
    });

    return args.id;
  },
});

export const deleteActivity = mutation({
  args: {
    id: v.id("activityEvents"),
  },
  handler: async (ctx, args): Promise<Id<"activityEvents">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const event = await ctx.db.get(args.id);
    if (!event || event.userId !== userId) {
      throw new Error("Activity not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const listEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const limit = args.limit ?? 20;

    const events = await ctx.db
      .query("activityEvents")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return events;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx): Promise<StatsSummary> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const now = Date.now();
    const startTime = now - 7 * DAY_MS;
    const events = await ctx.db
      .query("activityEvents")
      .withIndex("by_userId_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", startTime),
      )
      .collect();

    const lastPeriodStart = now - 2 * DAY_MS;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "active"),
      )
      .collect();

    const counts: StatCounts = {
      focusCount: 0,
      distractionCount: 0,
      focusMinutes: 0,
      distractionMinutes: 0,
      totalMinutes: 0,
    };

    const distractionLabels = new Map<string, { count: number; minutes: number }>();
    const hourlyCounts = new Map<number, number>();
    const recentStart = now - DAY_MS;
    let recentFocusMinutes = 0;
    let recentDistractionMinutes = 0;

    const currentDistractionMinutes = new Map<string, number>();
    const previousDistractionMinutes = new Map<string, number>();
    const currentHourlyCounts = new Map<number, number>();
    const previousHourlyCounts = new Map<number, number>();

    for (const event of events) {
      counts.totalMinutes += event.minutes;
      if (event.type === "focus") {
        counts.focusCount += 1;
        counts.focusMinutes += event.minutes;
      } else {
        counts.distractionCount += 1;
        counts.distractionMinutes += event.minutes;
        const existing = distractionLabels.get(event.label) ?? {
          count: 0,
          minutes: 0,
        };
        distractionLabels.set(event.label, {
          count: existing.count + 1,
          minutes: existing.minutes + event.minutes,
        });
      }

      if (event.createdAt >= recentStart) {
        if (event.type === "focus") {
          recentFocusMinutes += event.minutes;
        } else {
          recentDistractionMinutes += event.minutes;
        }
      }

      const hour = event.hourBucket ?? getHourBucket(event.createdAt);
      hourlyCounts.set(hour, (hourlyCounts.get(hour) ?? 0) + 1);
    }

    for (const event of events) {
      if (event.createdAt < lastPeriodStart || event.createdAt >= now) {
        continue;
      }
      const isPrevious = event.createdAt < recentStart;
      if (event.type === "distraction") {
        if (isPrevious) {
          const minutes = previousDistractionMinutes.get(event.label) ?? 0;
          previousDistractionMinutes.set(event.label, minutes + event.minutes);
        } else {
          const minutes = currentDistractionMinutes.get(event.label) ?? 0;
          currentDistractionMinutes.set(event.label, minutes + event.minutes);
        }
      }

      const hour = event.hourBucket ?? getHourBucket(event.createdAt);
      if (isPrevious) {
        previousHourlyCounts.set(hour, (previousHourlyCounts.get(hour) ?? 0) + 1);
      } else {
        currentHourlyCounts.set(hour, (currentHourlyCounts.get(hour) ?? 0) + 1);
      }
    }

    const topDistractions = Array.from(distractionLabels.entries())
      .map(([label, data]) => ({
        label,
        minutes: data.minutes,
      }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 3);

    const topDistraction = topDistractions[0]?.label ?? null;

    const peakHours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourlyCounts.get(hour) ?? 0,
    }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .filter((entry) => entry.count > 0)
      .map((entry) => entry.hour);

    const currentTopMinutes = topDistraction
      ? currentDistractionMinutes.get(topDistraction) ?? 0
      : 0;
    const previousTopMinutes = topDistraction
      ? previousDistractionMinutes.get(topDistraction) ?? 0
      : 0;
    const topDistractionTrend = getTrendDirection(currentTopMinutes, previousTopMinutes);

    const currentPeakCount = currentHourlyCounts.size
      ? Math.max(...Array.from(currentHourlyCounts.values()))
      : 0;
    const previousPeakCount = previousHourlyCounts.size
      ? Math.max(...Array.from(previousHourlyCounts.values()))
      : 0;
    const peakHoursTrend = getTrendDirection(currentPeakCount, previousPeakCount);

    const activeTasks = tasks
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

    const delayTotals = new Map<string, DelayCategoryTotals>();

    for (const task of tasks) {
      if (task.dueDate >= now) {
        continue;
      }
      const delayDays = (now - task.dueDate) / DAY_MS;
      const existing = delayTotals.get(task.category) ?? { totalDelayDays: 0, count: 0 };
      delayTotals.set(task.category, {
        totalDelayDays: existing.totalDelayDays + delayDays,
        count: existing.count + 1,
      });
    }

    const delayPatterns = Array.from(delayTotals.entries())
      .map(([category, data]) => ({
        category,
        avgDelayDays: Math.round((data.totalDelayDays / data.count) * 10) / 10,
      }))
      .sort((a, b) => b.avgDelayDays - a.avgDelayDays);

    const focusScore =
      counts.totalMinutes > 0
        ? Math.min(100, Math.max(0, Math.round((counts.focusMinutes / counts.totalMinutes) * 100)))
        : 0;
    const completedSessions = counts.focusCount;
    const avgSessionMinutes =
      counts.focusCount > 0 ? Math.round((counts.focusMinutes / counts.focusCount) * 10) / 10 : 0;
    const distractions = counts.distractionCount;

    const recentTotalMinutes = recentFocusMinutes + recentDistractionMinutes;
    const recentDistractionRatio =
      recentTotalMinutes > 0 ? recentDistractionMinutes / recentTotalMinutes : 0;

    let streakImpact = "no recent activity";
    if (recentTotalMinutes === 0) {
      streakImpact = "no recent activity";
    } else if (recentDistractionRatio <= 0.2) {
      streakImpact = "strong focus momentum";
    } else if (recentDistractionRatio <= 0.45) {
      streakImpact = "mixed focus pattern";
    } else {
      streakImpact = "high distraction drag";
    }

    let systemStatus: "stable" | "warning" | "critical" = "stable";
    if (counts.totalMinutes === 0) {
      systemStatus = "warning";
    } else if (focusScore >= 70) {
      systemStatus = "stable";
    } else if (focusScore >= 45) {
      systemStatus = "warning";
    } else {
      systemStatus = "critical";
    }

    const analyzingLabel = topDistraction ?? "all sessions";

    return {
      topDistraction,
      topDistractions,
      topDistractionTrend,
      peakHours,
      peakHoursTrend,
      streakImpact,
      systemStatus,
      analyzingLabel,
      counts,
      focusScore,
      completedSessions,
      avgSessionMinutes,
      distractions,
      delayPatterns,
      activeTasks,
    };
  },
});
