export async function broadcastToRoom<T>(
  roomId: string,
  event: string,
  payload: T
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_PUBLISHABLE_KEY;

  if (!supabaseUrl || !apiKey) {
    console.warn(
      "Supabase URL or API key missing. Realtime broadcast skipped."
    );
    return;
  }

  try {
    const res = await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            topic: `room:${roomId}`,
            event,
            payload,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error(
        `Failed to broadcast realtime event to room:${roomId}`,
        await res.text()
      );
    }
  } catch (error) {
    console.error("Failed to trigger realtime broadcast:", error);
  }
}
