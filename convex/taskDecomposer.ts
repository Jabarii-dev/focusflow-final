"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

type DecomposedStep = {
  title: string;
  minutes: number;
};

const isDecomposedStep = (value: unknown): value is DecomposedStep => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const step = value as { title?: unknown; minutes?: unknown };
  return (
    typeof step.title === "string" &&
    typeof step.minutes === "number" &&
    step.minutes >= 5 &&
    step.minutes <= 15
  );
};

const parseGroqError = (
  status: number,
  errorText: string
): { isModelError: boolean; message: string } => {
  const fallbackMessage = errorText || "Unknown error";
  if (!errorText) {
    return { isModelError: false, message: fallbackMessage };
  }

  try {
    const parsed = JSON.parse(errorText) as {
      error?: { type?: string; code?: string; message?: string };
    };
    const errorType = parsed?.error?.type;
    const errorCode = parsed?.error?.code;
    const isModelError =
      status === 400 &&
      (errorType === "model_decommissioned" ||
        errorType === "invalid_request_error" ||
        errorCode === "model_decommissioned" ||
        errorCode === "invalid_request_error");
    return {
      isModelError,
      message: parsed?.error?.message ?? fallbackMessage,
    };
  } catch (_error) {
    return { isModelError: false, message: fallbackMessage };
  }
};

export const decomposeTask = action({
  args: {
    task: v.string(),
    chunkMinutes: v.number(),
    timeAvailable: v.optional(v.string()),
    context: v.optional(v.string()),
  },
  returns: v.array(v.object({ title: v.string(), minutes: v.number() })),
  handler: async (_ctx, args) => {
    const apiToken = process.env.GROQ_API_KEY;
    if (!apiToken) {
      throw new Error("GROQ_API_KEY is not set");
    }

    const systemPrompt =
      "You are a task decomposition assistant. Return only valid JSON with no extra text.";
    const userPrompt = [
      "Decompose the task into a JSON array of steps with title and minutes.",
      "Minutes must be an integer between 5 and 15.",
      `Task: ${args.task}`,
      `Chunk minutes: ${args.chunkMinutes}`,
      `Time available: ${args.timeAvailable ?? "unspecified"}`,
      `Context: ${args.context ?? "none"}`,
      "Respond with only JSON array like: [{\"title\":\"...\",\"minutes\":10}].",
    ].join("\n");

    const modelOverride = process.env.GROQ_MODEL;
    const models = modelOverride
      ? [modelOverride]
      : ["llama-3.2-90b-text-preview", "llama-3.1-8b-instant"];

    let response: Response | null = null;
    let lastModelError: Error | null = null;

    for (let index = 0; index < models.length; index += 1) {
      const model = models[index];
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            temperature: 0.2,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          }),
          signal: controller.signal,
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("Groq request timed out after 15s");
        }
        throw error;
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        const errorText = await response.text();
        const { isModelError, message } = parseGroqError(
          response.status,
          errorText
        );
        const requestError = new Error(
          `Groq request failed (${response.status}) for model ${model}: ${message}`
        );
        if (isModelError) {
          lastModelError = requestError;
          if (index < models.length - 1) {
            continue;
          }
          break;
        }
        throw requestError;
      }

      lastModelError = null;
      break;
    }

    if (!response || !response.ok) {
      if (lastModelError) {
        throw new Error(
          `Groq request failed for all models. ${lastModelError.message}`
        );
      }
      throw new Error("Groq request failed without a response");
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Groq response missing content");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Groq response JSON parse failed: ${message}`);
      return [];
    }

    if (!Array.isArray(parsed)) {
      console.error("Groq response JSON is not an array");
      return [];
    }

    return parsed.filter(isDecomposedStep);
  },
});
