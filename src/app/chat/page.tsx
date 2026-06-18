import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { ChatScreen } from "@/components/chat/ChatScreen";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Ask GovEligify",
    description:
      "Chat with GovEligify to discover the government schemes and certificates you may qualify for. Sample experience; live matching coming soon.",
    path: "/chat",
  }),
  // Mock/sample experience — keep it out of search until live matching ships.
  robots: { index: false, follow: true },
};

export default function ChatPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  return <ChatScreen initialQuery={q} />;
}
