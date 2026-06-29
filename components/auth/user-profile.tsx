"use client";

import { getUserInitial } from "@/lib/auth/user";

type UserProfileProps = {
  user: {
    name: string | null;
    email: string | null;
  } | null;
};

export function UserProfile({ user }: UserProfileProps) {
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 backdrop-blur-md">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
        {getUserInitial(user.name)}
      </span>
      <div className="flex flex-col">
        <p className="text-xs font-semibold text-white">
          {user.name ?? "MyNews reader"}
        </p>
        <p className="text-xs text-zinc-400">{user.email ?? "Account"}</p>
      </div>
    </div>
  );
}
