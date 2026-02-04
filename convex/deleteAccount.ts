import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const deleteAccount = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<null> => {
    const userId = args.userId;
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Account not found.");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_userId_status", (q) => q.eq("userId", userId))
      .collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    const events = await ctx.db
      .query("activityEvents")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    const sessionIds = new Set<Id<"authSessions">>();
    for (const session of sessions) {
      sessionIds.add(session._id);
    }

    for (const session of sessions) {
      const refreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const refreshToken of refreshTokens) {
        await ctx.db.delete(refreshToken._id);
      }
      await ctx.db.delete(session._id);
    }

    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    const identifiers = new Set<string>();
    if (user.email) {
      identifiers.add(user.email);
    }
    if (user.phone) {
      identifiers.add(user.phone);
    }

    for (const account of accounts) {
      identifiers.add(account.providerAccountId);
      const verificationCodes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const code of verificationCodes) {
        await ctx.db.delete(code._id);
      }
      await ctx.db.delete(account._id);
    }

    if (sessionIds.size > 0) {
      const verifiers = await ctx.db
        .query("authVerifiers")
        .withIndex("signature")
        .collect();
      for (const verifier of verifiers) {
        if (verifier.sessionId && sessionIds.has(verifier.sessionId)) {
          await ctx.db.delete(verifier._id);
        }
      }
    }

    for (const identifier of identifiers) {
      const rateLimits = await ctx.db
        .query("authRateLimits")
        .withIndex("identifier", (q) => q.eq("identifier", identifier))
        .collect();
      for (const limit of rateLimits) {
        await ctx.db.delete(limit._id);
      }
    }

    try {
      const settings = await ctx.db
        .query("userSettings" as any)
        .withIndex("by_userId" as any, (q: any) => q.eq("userId", userId))
        .collect();
      for (const setting of settings) {
        await ctx.db.delete(setting._id);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!message.includes("userSettings")) {
        throw new Error("Unable to delete your account. Please try again.");
      }
    }

    await ctx.db.delete(userId);
    return null;
  },
});
