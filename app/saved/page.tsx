import type { Metadata } from "next"
import { SavedPage } from "@/components/saved/saved-page"

export const metadata: Metadata = {
  title: "Saved Briefings",
  description: "Your bookmarked stories and reading queue.",
}

export default function Page() {
  return <SavedPage />
}
