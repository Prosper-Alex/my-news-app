import Link from "next/link"

const featurePoints = [
  "Save headlines across devices and keep your reading queue synced.",
  "Pick up where you left off with a cleaner, faster account flow.",
  "Use email, password, or connected providers from a single surface.",
]

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(1000px_circle_at_80%_0%,rgba(244,114,182,0.18),transparent_45%),radial-gradient(900px_circle_at_40%_100%,rgba(16,185,129,0.16),transparent_45%)] bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <section className="max-w-xl space-y-6">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-zinc-200 uppercase backdrop-blur-md transition hover:border-white/20 hover:text-white"
          >
            MyNews
          </Link>

          <div className="space-y-4">
            <div className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">
              {eyebrow}
            </div>
            <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-lg text-base leading-7 text-zinc-300 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {featurePoints.map((point, index) => (
              <div
                key={point}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
              >
                <div className="text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
                  0{index + 1}
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{point}</p>
              </div>
            ))}
          </div>

          <p className="text-xs leading-6 text-zinc-500">
            By continuing, you agree to the{" "}
            <Link href="/terms" className="text-zinc-300 transition hover:text-white">
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-zinc-300 transition hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section className="w-full max-w-lg lg:ml-auto">{children}</section>
      </div>
    </div>
  )
}
