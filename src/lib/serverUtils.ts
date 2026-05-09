export type ModerationStatus = "clean" | "suspended";

export function isModerationBlocked(server: { moderationStatus?: ModerationStatus }): boolean {
  return server.moderationStatus === "suspended";
}

export function isDisplayActive(server: { status: string; moderationStatus?: ModerationStatus }): boolean {
  return server.status !== "deleted" && !isModerationBlocked(server);
}

export function isRenewable(server: { status: string; moderationStatus?: ModerationStatus }): boolean {
  return server.status !== "deleted" && !isModerationBlocked(server);
}