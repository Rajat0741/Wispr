"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface SimpleMessage {
  id: string;
  text: string;
  senderId: string;
}

function GlobalChat() {
  const { data: session } = authClient.useSession();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<SimpleMessage[]>([]);

  const handleSend = () => {
    if (!inputValue.trim() || !session?.user) return;
    const newMsg: SimpleMessage = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      senderId: session.user.id,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  const isMine = (msg: SimpleMessage) => msg.senderId === session?.user.id;

  return (
    <div className="flex flex-col w-full max-w-3xl h-[calc(100vh-2rem)] m-4 bg-white border border-gray-200 rounded-lg overflow-hidden mx-auto">
      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
        <h1 className="text-lg font-medium text-gray-900">Global Chat</h1>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${isMine(msg) ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                isMine(msg)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">No messages yet</p>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function GlobalPage() {
  return <GlobalChat />;
}
