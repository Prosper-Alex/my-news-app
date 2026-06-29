export const clerkAppearance = {
  layout: {
    socialButtonsVariant: "block",
    socialButtonsPlacement: "top",
  },
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "transparent",
    colorText: "#f5f5f5",
    colorTextSecondary: "#a1a1aa",
    colorInputBackground: "rgba(9, 9, 11, 0.72)",
    colorInputText: "#f5f5f5",
    borderRadius: "1rem",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full",
    card: "rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-md",
    headerTitle: "text-3xl font-semibold tracking-tight text-white",
    headerSubtitle: "text-sm leading-6 text-zinc-400",
    socialButtonsBlockButton:
      "h-12 rounded-2xl border border-white/10 bg-black/30 text-zinc-100 shadow-none transition hover:border-white/20 hover:bg-white/10",
    socialButtonsBlockButtonText: "font-semibold text-zinc-100",
    dividerLine: "bg-white/10",
    dividerText:
      "bg-transparent px-3 text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase",
    formFieldLabel:
      "text-[11px] font-semibold tracking-[0.16em] text-zinc-400 uppercase",
    formFieldInput:
      "h-12 rounded-2xl border border-white/10 bg-black/30 text-base text-white shadow-none placeholder:text-zinc-500 focus:border-cyan-300/50 focus:bg-black/40 focus:ring-0",
    formButtonPrimary:
      "h-12 rounded-2xl bg-white text-sm font-semibold text-black shadow-none transition hover:bg-zinc-200",
    footer: "bg-transparent",
    footerActionText: "text-zinc-400",
    footerActionLink: "font-semibold text-white transition hover:text-cyan-200",
    formFieldErrorText: "text-sm text-rose-200",
    formFieldWarningText: "text-sm text-amber-200",
    alert:
      "rounded-2xl border border-rose-400/25 bg-rose-500/10 text-sm text-rose-100",
    alertText: "text-sm text-rose-100",
    identityPreviewText: "text-zinc-300",
    identityPreviewEditButton: "text-cyan-200 transition hover:text-white",
    otpCodeFieldInput:
      "h-12 rounded-2xl border border-white/10 bg-black/30 text-white shadow-none",
  },
}
