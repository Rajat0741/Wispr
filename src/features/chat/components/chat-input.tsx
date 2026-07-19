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
    <form className="flex gap-2 border-t p-3" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        disabled={isSending}
        className="flex-1"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!inputValue.trim() || isSending}
        aria-label="Send message"
      >
        <SendIcon className="size-4" />
      </Button>
    </form>
  );
}
