"use client";

type ApiConfigErrorProps = {
  hint?: string;
  showSetupGuide?: boolean;
};

export function ApiConfigError({
  hint,
  showSetupGuide = false,
}: ApiConfigErrorProps) {
  return (
    <div className="space-y-4 rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-950 to-amber-900/50 p-6 backdrop-blur-md">
      <div className="space-y-2">
        <div className="text-base font-semibold text-amber-100">
          ⚠️ News API Not Configured
        </div>
        <p className="text-sm leading-6 text-amber-50/80">
          {hint ||
            "The server is not configured with a NEWS_API_KEY environment variable. News cannot be fetched until this is set."}
        </p>
      </div>

      {showSetupGuide && (
        <div className="space-y-3 border-t border-amber-500/20 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-200">
            Quick Setup
          </div>
          <ol className="space-y-2 text-sm text-amber-50/80">
            <li className="flex gap-2">
              <span className="font-semibold text-amber-300">1.</span>
              <span>
                Get a free API key from{" "}
                <a
                  href="https://newsapi.org/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-200 underline hover:text-amber-100">
                  newsapi.org
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-amber-300">2.</span>
              <span>Create a `.env` file in the project root</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-amber-300">3.</span>
              <span className="font-mono bg-amber-950/50 px-2 py-1">
                NEWS_API_KEY=your_key_here
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-amber-300">4.</span>
              <span>Restart your development server</span>
            </li>
          </ol>
        </div>
      )}

      <div className="space-y-2 border-t border-amber-500/20 pt-4 text-xs text-amber-50/60">
        <p>
          <strong className="text-amber-200">See:</strong> .env.example for
          configuration template
        </p>
      </div>
    </div>
  );
}
