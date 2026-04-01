"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/toast";

const PREFERENCES = [
  { id: "business", label: "Business", emoji: "💼" },
  { id: "technology", label: "Technology", emoji: "💻" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "health", label: "Health", emoji: "🏥" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleComplete = async () => {
    if (selectedCategories.length === 0) {
      addToast("Please select at least one category", "warning");
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you'd save this to the database via an API
      // For now, we'll just store in localStorage as a demo
      localStorage.setItem(
        "userPreferences",
        JSON.stringify({
          categories: selectedCategories,
          setupComplete: true,
          setupDate: new Date().toISOString(),
        }),
      );

      addToast("Profile setup complete!", "success");
      router.replace("/dashboard");
    } catch (error) {
      addToast("Failed to save preferences", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black px-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">
            Welcome, {session?.user?.name}!
          </h1>
          <p className="text-zinc-400">
            Let's customize your news feed to match your interests
          </p>
        </div>

        {/* Preferences Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold text-white">{session?.user?.name}</p>
              <p className="text-sm text-zinc-400">{session?.user?.email}</p>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Choose Your Interests
            </h2>
            <p className="text-sm text-zinc-400">
              Select the topics you're most interested in. You can change these
              anytime in settings.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => toggleCategory(pref.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategories.includes(pref.id)
                      ? "border-blue-500 bg-blue-500/20 text-white"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"
                  }`}>
                  <div className="text-2xl mb-1">{pref.emoji}</div>
                  <div className="text-sm font-medium">{pref.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Count */}
          {selectedCategories.length > 0 && (
            <div className="rounded-lg bg-green-900/20 p-3 border border-green-500/20">
              <p className="text-sm text-green-200">
                ✓ {selectedCategories.length} categor
                {selectedCategories.length === 1 ? "y" : "ies"} selected
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors disabled:opacity-50">
            Skip for Now
          </button>
          <button
            type="button"
            onClick={handleComplete}
            disabled={isLoading || selectedCategories.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-zinc-500">
          Your preferences help us personalize your news experience
        </p>
      </div>
    </div>
  );
}
