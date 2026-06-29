import { SignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { getCurrentSession } from "@/lib/auth"
import { clerkAppearance } from "@/lib/clerk-theme"

export const metadata = {
  title: "Sign In | MyNews",
  description: "Sign in to continue your MyNews briefing.",
}

export default async function LoginPage() {
  const session = await getCurrentSession()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <AuthShell
      eyebrow="Sign In"
      title="Welcome back to your daily briefing."
      description="Jump back into saved stories, topic picks, and the cleaner reading queue you already started building."
    >
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path="/login"
        signUpUrl="/register"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthShell>
  )
}
