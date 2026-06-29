import { SignUp } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { getCurrentSession } from "@/lib/auth"
import { clerkAppearance } from "@/lib/clerk-theme"

export const metadata = {
  title: "Create Account | MyNews",
  description: "Create your MyNews account and personalize your feed.",
}

export default async function RegisterPage() {
  const session = await getCurrentSession()

  if (session?.user) {
    redirect("/onboarding")
  }

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Set up a faster way back to the headlines."
      description="Create your account once, then keep bookmarks, preferences, and your news rhythm in one place."
    >
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path="/register"
        signInUrl="/login"
        fallbackRedirectUrl="/onboarding"
      />
    </AuthShell>
  )
}
