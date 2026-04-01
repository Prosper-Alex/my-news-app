import { fetchTopHeadlines } from "@/lib/api";
import { HomePage } from "@/components/home/home-page";

// Dynamic rendering: prevents build-time fetch errors
// Uses SSR to fetch fresh data on each request
export const dynamic = "force-dynamic";
export const revalidate = false;

export default async function Page() {
  try {
    const initialItems = await fetchTopHeadlines({
      country: "us",
      todayOnly: true,
    });
    return <HomePage initialItems={initialItems} />;
  } catch (error) {
    // Gracefully handle fetch errors
    console.error("Failed to fetch initial news:", error);
    return <HomePage initialItems={[]} />;
  }
}
