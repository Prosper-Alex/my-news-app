import type { ReactNode } from "react";

export const metadata = {
  title: "Authentication | News App",
  description:
    "Sign in or create an account to access your personalized news feed",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
