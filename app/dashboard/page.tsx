import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { EnhancedAuthButton } from "@/components/auth/enhanced-auth-button";
import { getUserInitial } from "@/lib/auth/user";

export const metadata = {
  title: "Dashboard | News App",
  description: "Your personalized news dashboard",
};

export default async function DashboardPage() {
  const session = await getCurrentSession();

  // Protect route: redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">News Dashboard</h1>
          <EnhancedAuthButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Welcome Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Welcome, {session.user.name}!
          </h2>
          <p className="text-zinc-300">
            You are now authenticated and can see personalized content. This
            dashboard is protected and only accessible to logged-in users.
          </p>
        </div>

        {/* User info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Profile Information
            </h3>
            <div className="space-y-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-white">
                {getUserInitial(session.user.name)}
              </div>
              <div>
                <p className="text-sm text-zinc-400">Name</p>
                <p className="text-white font-medium">{session.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Email</p>
                <p className="text-white font-medium">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Session Info Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Session Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-zinc-400">Status</p>
                <p className="text-green-400 font-medium">✓ Authenticated</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Provider</p>
                <p className="text-white font-medium">Clerk</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">User ID</p>
                <p className="text-white font-mono text-xs truncate">
                  {session.user?.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md space-y-4">
          <h3 className="text-lg font-semibold text-white">What Is Available</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Personalized Feed",
                description: "News curated to your interests",
              },
              {
                title: "Saved Articles",
                description: "Bookmark and organize your reads",
              },
              {
                title: "Category Browsing",
                description: "Explore news by topic",
              },
              {
                title: "Search",
                description: "Find specific topics or sources",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg bg-white/10 p-4 border border-white/10">
                <p className="font-semibold text-white">{feature.title}</p>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: "/", label: "🏠 Home", desc: "Back to main feed" },
              {
                href: "/saved",
                label: "❤️ Bookmarks",
                desc: "Your saved articles",
              },
              {
                href: "/discover",
                label: "🔍 Discover",
                desc: "Explore new topics",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-4 transition-colors">
                <p className="font-semibold text-white">{link.label}</p>
                <p className="text-sm text-zinc-400">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
