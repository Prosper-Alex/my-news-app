import { fetchTopHeadlines } from "@/lib/api"
import { HomePage } from "@/components/home/home-page"

export default async function Page() {
  const initialItems = await fetchTopHeadlines({
    country: "us",
    todayOnly: true,
  })

  return (
    <HomePage initialItems={initialItems} />
  )
}
