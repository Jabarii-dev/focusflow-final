import { getAuthUserId } from "@convex-dev/auth/server";
import { Infer, v } from "convex/values";
import { query } from "./_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;
const SPARKLINE_DAYS = 7;

const dashboardStatsValidator = v.object({
  focusMinutes: v.number(),
  distractionCount: v.number(),
  tasksCompleted: v.number(),
  productivityScore: v.number(),
  focusMinutesSparkline: v.array(v.number()),
  distractionCountSparkline: v.array(v.number()),
  tasksCompletedSparkline: v.array(v.number()),
  productivityScoreSparkline: v.array(v.number()),
});

type DashboardStats = Infer<typeof dashboardStatsValidator>;

const getDayStart = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const getDayIndex = (timestamp: number, startTime: number) =>
  Math.floor((timestamp - startTime) / DAY_MS);

const createSparkline = () =>
  Array.from({ length: SPARKLINE_DAYS }, () => 0);

export const getDashboardStats = query({
  args: {},
  handler: async (ctx): Promise<DashboardStats> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const now = Date.now();
    const todayStart = getDayStart(now);
    const startTime = todayStart - (SPARKLINE_DAYS - 1) * DAY_MS;

    const focusMinutesSparkline = createSparkline();
    const distractionCountSparkline = createSparkline();
    const tasksCompletedSparkline = createSparkline();
    const productivityScoreSparkline = createSparkline();
    const distractionMinutesSparkline = createSparkline();

    const events = await ctx.db
      .query("activityEvents")
      .withIndex("by_userId_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", startTime),
      )
      .collect();

    let focusMinutes = 0;
    let distractionCount = 0;
    let distractionMinutes = 0;

    for (const event of events) {
      const dayIndex = getDayIndex(event.createdAt, startTime);
      if (dayIndex < 0 || dayIndex >= SPARKLINE_DAYS) {
        continue;
      }

      if (event.type === "focus") {
        focusMinutes += event.minutes;
        focusMinutesSparkline[dayIndex] += event.minutes;
      } else {
        distractionCount += 1;
        distractionMinutes += event.minutes;
        distractionCountSparkline[dayIndex] += 1;
        distractionMinutesSparkline[dayIndex] += event.minutes;
      }
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "done"),
      )
      .collect();

    let tasksCompleted = 0;

    for (const task of tasks) {
      const dayIndex = getDayIndex(task.createdAt, startTime);
      if (dayIndex < 0 || dayIndex >= SPARKLINE_DAYS) {
        continue;
      }

      tasksCompleted += 1;
      tasksCompletedSparkline[dayIndex] += 1;
    }

    const totalMinutes = focusMinutes + distractionMinutes;
    const productivityScore =
      totalMinutes > 0 ? Math.round((focusMinutes / totalMinutes) * 100) : 0;

    for (let i = 0; i < SPARKLINE_DAYS; i += 1) {
      const dayTotal = focusMinutesSparkline[i] + distractionMinutesSparkline[i];
      productivityScoreSparkline[i] =
        dayTotal > 0 ? Math.round((focusMinutesSparkline[i] / dayTotal) * 100) : 0;
    }

    return {
      focusMinutes,
      distractionCount,
      tasksCompleted,
      productivityScore,
      focusMinutesSparkline,
      distractionCountSparkline,
      tasksCompletedSparkline,
      productivityScoreSparkline,
    };
  },
});
