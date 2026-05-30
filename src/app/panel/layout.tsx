import { getUser, getAvatarUrl } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import PanelShell from "./PanelShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  const db = (await clientPromise).db();
  const record = await db.collection("users").findOne(
    { discordId: user.id },
    { projection: { banned: 1 } }
  );

  if (record?.banned === true) redirect("/banned");

  return (
    <PanelShell username={user.username} avatarUrl={getAvatarUrl(user)}>
      {children}
    </PanelShell>
  );
}
