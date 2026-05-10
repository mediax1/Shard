import type { PatternMatch } from "./malwareDetector";
import { formatMatchSummary } from "./malwareDetector";

export interface AlertPayload {
  discordId: string;
  serverId: string;
  pteroId: number;
  matches: PatternMatch[];
  timestamp: Date;
}

export async function sendMalwareAlert(payload: AlertPayload): Promise<void> {
  const webhookUrl = process.env.DISCORD_MODERATION_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("DISCORD_MODERATION_WEBHOOK_URL is not set.");

  const summary = formatMatchSummary(payload.matches);
  const allPatterns = payload.matches
    .map((m) => `• \`${m.patternId}\` — ${m.description}${m.lineNumber ? ` (line ${m.lineNumber})` : ""}`)
    .join("\n");

  const body = {
    username: "Shard Detector",
    embeds: [
      {
        title: "🚨 Malicious Code Detected — Server Auto-Suspended",
        color: 0xff3333,
        fields: [
          { name: "Discord ID", value: payload.discordId, inline: true },
          { name: "Server ID", value: payload.serverId, inline: true },
          { name: "Pterodactyl ID", value: String(payload.pteroId), inline: true },
          { name: "Primary Match", value: summary, inline: false },
          { name: "All Matched Patterns", value: allPatterns || "N/A", inline: false },
          { name: "Action Taken", value: "Server suspended + `moderationStatus` set to `suspended`", inline: false },
        ],
        timestamp: payload.timestamp.toISOString(),
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Discord webhook error ${res.status}: ${err}`);
  }
}