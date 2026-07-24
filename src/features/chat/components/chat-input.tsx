import { SendIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void | Promise<void>;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || isSending) return;

    setIsSending(true);
    try {
      await onSend(text);
      setInputValue("");
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form className="flex items-center gap-2 p-4" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        maxLength={10000}
        disabled={isSending}
        className="h-12 flex-1 px-4 py-2.5 rounded-full bg-accent focus-visible:ring-0 focus-visible:border-border"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!inputValue.trim() || isSending}
        aria-label="Send message"
        className="size-11 shrink-0 rounded-full"
      >
        <SendIcon className="size-5" />
      </Button>
    </form>
  );
}
