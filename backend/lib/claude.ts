import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

export const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export async function analyzeFeedback(content: string) {
  if (!anthropic) {
    return {
      sentiment: "NEUTRAL",
      sentimentScore: 0,
      theme: "General",
      confidence: 0.5,
    };
  }

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 250,
    messages: [
      {
        role: "user",
        content: `Classify this customer feedback into one of: POSITIVE, NEGATIVE, NEUTRAL, MIXED. Return JSON with sentiment, sentimentScore, theme, confidence. Feedback: ${content}`,
      },
    ],
  });

  const text = response.content[0]?.type === "text" ? response.content[0].text : "{}";
  try {
    const parsed = JSON.parse(text);
    return {
      sentiment: parsed.sentiment ?? "NEUTRAL",
      sentimentScore: typeof parsed.sentimentScore === "number" ? parsed.sentimentScore : 0,
      theme: parsed.theme ?? "General",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
    };
  } catch {
    return {
      sentiment: "NEUTRAL",
      sentimentScore: 0,
      theme: "General",
      confidence: 0.5,
    };
  }
}
