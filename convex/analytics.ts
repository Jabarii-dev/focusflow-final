import { getAuthUserId } from "@convex-dev/auth/server";
import { Infer, v } from "convex/values";
import { query } from "./_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const DEFAULT_DAYS = 7;
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDayStart = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const getDayIndex = (timestamp: number, startTime: number) =>
  Math.floor((timestamp - startTime) / DAY_MS);

const getDayLabel = (timestamp: number) => DAY_LABELS[new Date(timestamp).getDay()];

const formatHourLabel = (hour: number) => {
  const period = hour >= 12 ? "pm" : "am";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}${period}`;
};

const roundTo = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

type WeeklyFocusTrend = {
  date: number;
  day: string;
  focusMinutes: number;
  focusHours: number;
  focusScore: number;
};

type DistractionSource = {
  label: string;
  minutes: number;
  percentage: number;
};

type PeakPerformanceHour = {
  hour: number;
  label: string;
  focusMinutes: number;
};

type Insight = {
  title: string;
  text: string;
};

type AnalyticsSummary = {
  weeklyFocusTrend: WeeklyFocusTrend[];
  distractionSources: DistractionSource[];
  peakPerformanceHours: PeakPerformanceHour[];
  aiInsights: Insight[];
};

type DistractionCost = {
  totalDistractionMinutes: number;
  hourlyRate: number;
  dailyCost: number;
  annualProjection: number;
  contextSwitches: number;
};

type LiveStoppage = {
  label: string;
  minutes: number;
  impactScore: number;
  createdAt: number;
};

type LiveStoppages = {
  stoppages: LiveStoppage[];
  since: number;
};

const weeklyReportSummaryValidator = v.object({
  startDate: v.number(),
  endDate: v.number(),
  days: v.number(),
  focusMinutes: v.number(),
  distractionMinutes: v.number(),
  totalMinutes: v.number(),
  focusScore: v.number(),
});

const weeklyReportRowValidator = v.object({
  date: v.number(),
  focusMinutes: v.number(),
  distractionMinutes: v.number(),
});

type WeeklyReportSummary = Infer<typeof weeklyReportSummaryValidator>;

type WeeklyReportRow = Infer<typeof weeklyReportRowValidator>;

type WeeklyReport = {
  summary: WeeklyReportSummary;
  csvRows: WeeklyReportRow[];
};

export const getWeeklyReport = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<WeeklyReport> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const days = Math.max(1, Math.min(30, Math.floor(args.days ?? DEFAULT_DAYS)));
    const now = Date.now();
    const todayStart = getDayStart(now);
    const startDate = todayStart - (days - 1) * DAY_MS;

    const events = await ctx.db
      .query("activityEvents")
      .withIndex("by_userId_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", startDate),
      )
      .collect();

    const dailyFocusMinutes = Array.from({ length: days }, () => 0);
    const dailyDistractionMinutes = Array.from({ length: days }, () => 0);

    for (const event of events) {
      const dayIndex = getDayIndex(event.createdAt, startDate);
      if (dayIndex < 0 || dayIndex >= days) {
        continue;
      }

      if (event.type === "focus") {
        dailyFocusMinutes[dayIndex] += event.minutes;
      } else {
        dailyDistractionMinutes[dayIndex] += event.minutes;
      }
    }

    const csvRows: WeeklyReportRow[] = Array.from({ length: days }, (_, index) => ({
      date: startDate + index * DAY_MS,
      focusMinutes: dailyFocusMinutes[index],
      distractionMinutes: dailyDistractionMinutes[index],
    }));

    const focusMinutes = dailyFocusMinutes.reduce((total, minutes) => total + minutes, 0);
    const distractionMinutes = dailyDistractionMinutes.reduce(
      (total, minutes) => total + minutes,
      0,
    );
    const totalMinutes = focusMinutes + distractionMinutes;

    return {
      summary: {
        startDate,
        endDate: todayStart,
        days,
        focusMinutes,
        distractionMinutes,
        totalMinutes,
        focusScore: totalMinutes > 0 ? Math.round((focusMinutes / totalMinutes) * 100) : 0,
      },
      csvRows,
    };
  },
});

export const getAnalyticsSummary = query({
  args: {},
  handler: async (ctx): Promise<AnalyticsSummary> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const now = Date.now();
    const todayStart = getDayStart(now);
    const startTime = todayStart - (DEFAULT_DAYS - 1) * DAY_MS;

    const events = await ctx.db
      .query("activityEvents")
      .withIndex("by_userId_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", startTime),
      )
      .collect();

    const dailyFocusMinutes = Array.from({ length: DEFAULT_DAYS }, () => 0);
    const dailyTotalMinutes = Array.from({ length: DEFAULT_DAYS }, () => 0);
    const distractionMinutesByLabel = new Map<string, number>();
    const focusMinutesByHour = new Map<number, number>();

    let totalFocusMinutes = 0;
    let totalDistractionMinutes = 0;
    let focusSessions = 0;
    let distractionSessions = 0;

    for (const event of events) {
      const dayIndex = getDayIndex(event.createdAt, startTime);
      if (dayIndex < 0 || dayIndex >= DEFAULT_DAYS) {
        continue;
      }

      dailyTotalMinutes[dayIndex] += event.minutes;

      if (event.type === "focus") {
        dailyFocusMinutes[dayIndex] += event.minutes;
        totalFocusMinutes += event.minutes;
        focusSessions += 1;
        const hour = event.hourBucket ?? new Date(event.createdAt).getHours();
        focusMinutesByHour.set(hour, (focusMinutesByHour.get(hour) ?? 0) + event.minutes);
      } else {
        totalDistractionMinutes += event.minutes;
        distractionSessions += 1;
        distractionMinutesByLabel.set(
          event.label,
          (distractionMinutesByLabel.get(event.label) ?? 0) + event.minutes,
        );
      }
    }

    const weeklyFocusTrend: WeeklyFocusTrend[] = Array.from(
      { length: DEFAULT_DAYS },
      (_, index) => {
        const date = startTime + index * DAY_MS;
        const focusMinutes = dailyFocusMinutes[index];
        const totalMinutes = dailyTotalMinutes[index];
        return {
          date,
          day: getDayLabel(date),
          focusMinutes,
          focusHours: roundTo(focusMinutes / 60, 1),
          focusScore:
            totalMinutes > 0 ? Math.round((focusMinutes / totalMinutes) * 100) : 0,
        };
      },
    );

    const distractionSources: DistractionSource[] = Array.from(
      distractionMinutesByLabel.entries(),
    )
      .map(([label, minutes]) => ({
        label,
        minutes,
        percentage:
          totalDistractionMinutes > 0
            ? roundTo((minutes / totalDistractionMinutes) * 100, 1)
            : 0,
      }))
      .sort((a, b) => b.minutes - a.minutes);

    const peakPerformanceHours: PeakPerformanceHour[] = Array.from(
      { length: 24 },
      (_, hour) => ({
        hour,
        label: formatHourLabel(hour),
        focusMinutes: focusMinutesByHour.get(hour) ?? 0,
      }),
    )
      .filter((entry) => entry.focusMinutes > 0)
      .sort((a, b) => b.focusMinutes - a.focusMinutes)
      .slice(0, 5);

    const totalMinutes = totalFocusMinutes + totalDistractionMinutes;
    const focusRatio = totalMinutes > 0 ? totalFocusMinutes / totalMinutes : 0;
    const sessionRatio =
      focusSessions + distractionSessions > 0
        ? distractionSessions / (focusSessions + distractionSessions)
        : 0;

    const topDistraction = distractionSources[0];

    const aiInsights: Insight[] = [
      {
        title: "Focus balance",
        text:
          totalMinutes === 0
            ? "Log focus sessions to see how your attention is split."
            : `Focus time is ${Math.round(focusRatio * 100)}% of your tracked work. ${
                focusRatio >= 0.7
                  ? "Keep protecting those deep work blocks."
                  : focusRatio >= 0.5
                    ? "Aim to reduce low-value interruptions."
                    : "Consider setting stricter boundaries for focus time."
              }`,
      },
      {
        title: "Context switching",
        text:
          focusSessions + distractionSessions === 0
            ? "Track distractions to understand context switches."
            : `Distractions account for ${Math.round(
                sessionRatio * 100,
              )}% of sessions. ${
                sessionRatio <= 0.25
                  ? "You are maintaining strong continuity."
                  : sessionRatio <= 0.5
                    ? "Try batching quick checks to cut switches."
                    : "High switching suggests your focus is getting fragmented."
              }`,
      },
      {
        title: "Top distraction",
        text: topDistraction
          ? `${topDistraction.label} drives ${roundTo(
              topDistraction.percentage,
              1,
            )}% of distraction time. Consider muting it during focus blocks.`
          : "No dominant distraction source yet. Keep logging to spot patterns.",
      },
    ];

    return {
      weeklyFocusTrend,
      distractionSources,
      peakPerformanceHours,
      aiInsights,
    };
  },
});

export const getDistractionCost = query({
  args: {
    hourlyRate: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<DistractionCost> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const now = Date.now();
    const startTime = now - DEFAULT_DAYS * DAY_MS;

    const events = await ctx.db
      .query("activityEvents")
      .withIndex("by_userId_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", startTime),
      )
      .collect();

    let totalDistractionMinutes = 0;
    let contextSwitches = 0;

    for (const event of events) {
      if (event.type !== "distraction") {
        continue;
      }
      totalDistractionMinutes += event.minutes;
      contextSwitches += 1;
    }

    const hourlyRate = args.hourlyRate ?? 25;
    const dailyDistractionHours = totalDistractionMinutes / 60 / DEFAULT_DAYS;
    const dailyCost = roundTo(dailyDistractionHours * hourlyRate, 2);
    const annualProjection = roundTo(dailyCost * 365, 2);

    return {
      totalDistractionMinutes,
      hourlyRate,
      dailyCost,
      annualProjection,
      contextSwitches,
    };
  },
});

export const getLiveStoppages = query({
  args: {},
  handler: async (ctx): Promise<LiveStoppages> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    const now = Date.now();
    const startTime = now - 24 * HOUR_MS;

    const recentEvents = await ctx.db
      .query("activityEvents")
      .withIndex("by_userId_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", startTime),
      )
      .order("desc")
      .take(30);

    const stoppages: LiveStoppage[] = [];

    for (const event of recentEvents) {
      if (event.type !== "distraction") {
        continue;
      }
      const impactScore = Math.min(100, Math.round((event.minutes / 30) * 100));
      stoppages.push({
        label: event.label,
        minutes: event.minutes,
        impactScore,
        createdAt: event.createdAt,
      });
      if (stoppages.length >= 6) {
        break;
      }
    }

    return {
      stoppages,
      since: startTime,
    };
  },
});
