"use client";

import Image from "next/image";
import type { Session } from "next-auth";

export function UserProfile({ session }: { session: Session | null }) {
  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 backdrop-blur-md">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name ?? "User avatar"}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <div className="flex flex-col">
        <p className="text-xs font-semibold text-white">{session.user.name}</p>
        <p className="text-xs text-zinc-400">{session.user.email}</p>
      </div>
    </div>
  );
}
