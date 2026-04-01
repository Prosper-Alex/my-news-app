import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { GitHubSignInButton } from "@/components/auth/github-signin-button";

export const metadata = {
  title: "Sign In | News App",
  description: "Sign in to your news app account",
};

export default async function LoginPage() {
  const session = await getCurrentSession();

  // Redirect if already authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-zinc-400">
            Stay updated with the latest news from around the world
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md space-y-6">
          {/* GitHub Sign In */}
          <div className="space-y-4">
            <GitHubSignInButton size="lg" fullWidth />
            <p className="text-xs text-center text-zinc-400">
              We'll create an account automatically when you sign in
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900/50 text-zinc-500">
                Demo Access
              </span>
            </div>
          </div>

          {/* Demo Info */}
          <div className="rounded-lg bg-blue-900/20 p-4 border border-blue-500/20">
            <p className="text-sm text-blue-200">
              <span className="font-semibold">Demo Mode:</span> GitHub OAuth is
              configured. Sign in with your GitHub account to test the full
              authentication flow.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300 text-center">
            What you'll get
          </h2>
          <ul className="grid grid-cols-1 gap-3">
            {[
              "📰 Personalized news feed",
              "🔐 Secure authentication",
              "❤️ Bookmark your favorites",
              "🌍 Multi-country coverage",
            ].map((feature) => (
              <li
                key={feature}
                className="text-sm text-zinc-300 flex items-center gap-2">
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-zinc-500">
          By signing in, you agree to our{" "}
          <a
            href="/privacy"
            className="text-zinc-300 hover:text-white transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
