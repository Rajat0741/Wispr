import "server-only";
import { REALTIME_TOPICS } from "@/features/chat/constants";

async function broadcastToTopics<T>(
  topics: string[],
  event: string,
  payload: T,
) {
  const uniqueTopics = Array.from(new Set(topics));
  if (uniqueTopics.length === 0) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase URL or service role key is missing. Realtime broadcast aborted.",
    );
  }

  try {
    const res = await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: uniqueTopics.map((topic) => ({
          topic,
          event,
          payload,
          private: true,
        })),
      }),
    });

    if (!res.ok) {
      const responseText = await res.text();
      throw new Error(
        `Failed to broadcast realtime event to ${uniqueTopics.join(", ")}: ${responseText}`,
      );
    }
  } catch (error) {
    console.error("Failed to trigger realtime broadcast:", error);
    throw error;
  }
}

export function broadcastToRoom<T>(roomId: string, event: string, payload: T) {
  return broadcastToTopics([REALTIME_TOPICS.room(roomId)], event, payload);
}

export function broadcastToUsers<T>(
  userIds: string[],
  event: string,
  payload: T,
) {
  return broadcastToTopics(
    userIds.map(REALTIME_TOPICS.chatList),
    event,
    payload,
  );
}
