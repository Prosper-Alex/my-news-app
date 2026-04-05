import type { ReactNode } from "react";

export const metadata = {
  title: "Authentication | MyNews",
  description: "Sign in or create an account to access your MyNews briefing.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
