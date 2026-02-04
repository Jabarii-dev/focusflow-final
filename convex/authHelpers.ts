"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { modifyAccountCredentials, getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

const accountNotFoundMessage = "Account not found. Please sign up first.";

export const forceResetPassword = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: {
          id: args.email,
          secret: args.password,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("Cannot modify account") || message.includes("does not exist")) {
        throw new Error(accountNotFoundMessage);
      }
      throw new Error("Unable to reset your password. Please try again.");
    }
    return null;
  },
});

export const updatePassword = action({
  args: {
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // Assuming email is available in identity.email or identity.name (depending on setup)
    // For password auth, email is usually the identifier.
    const email = identity.email;
    if (!email) {
      throw new Error("Could not determine account email");
    }

    try {
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: {
          id: email,
          secret: args.newPassword,
        },
      });
    } catch (error) {
      throw new Error(
        "Failed to update password: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  },
});

export const deleteAccount = action({
  args: {},
  handler: async (ctx): Promise<null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Please sign in to continue");
    }

    await ctx.runMutation(internal.deleteAccount.deleteAccount, { userId });
    return null;
  },
});
