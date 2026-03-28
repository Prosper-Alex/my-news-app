"use client"

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-3 px-4 py-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>© {new Date().getFullYear()} MyNews</div>
        <div className="flex gap-4">
          <a className="hover:text-white" href="#">
            About
          </a>
          <a className="hover:text-white" href="#">
            Privacy
          </a>
          <a className="hover:text-white" href="#">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
