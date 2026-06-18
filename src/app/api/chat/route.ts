import { NextResponse } from "next/server";
import type { BotTurn, Message } from "@/lib/types";
import { mockEngine } from "@/lib/chat/mockEngine";

/**
 * UI → /api/chat → engine seam. Phase-1 calls the local mock engine and returns
 * the BotTurn as JSON. Phase-2 swaps the engine internals (RAG / streaming)
 * without changing this contract or any UI code.
 */
export const runtime = "nodejs";

interface ChatRequestBody {
  message?: string;
  history?: Message[];
}

const MAX_BODY_BYTES = 64 * 1024; // 64 KB
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_ITEMS = 30;

export async function POST(req: Request): Promise<NextResponse> {
  // Cheap first guard against oversized payloads.
  const declaredLen = Number(req.headers.get("content-length") ?? 0);
  if (declaredLen > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = (typeof body.message === "string" ? body.message : "").trim();
  if (!message) {
    return NextResponse.json({ error: "Missing 'message'" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: "Message too long" }, { status: 413 });
  }

  // Bound the history: only keep the most recent items, each a well-formed message.
  const history = (Array.isArray(body.history) ? body.history : [])
    .filter((m): m is Message => !!m && typeof (m as Message).content === "string")
    .slice(-MAX_HISTORY_ITEMS);

  try {
    const turn: BotTurn = await mockEngine.send(message, history);
    return NextResponse.json(turn);
  } catch {
    const fallback: BotTurn = {
      messages: [
        {
          content:
            "Sorry, something went wrong on my side. Please try again in a moment.",
        },
      ],
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}
