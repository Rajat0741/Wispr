"use client";

import { SendIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const messages = [
  { id: 1, text: "Hey! How are you?", sender: "other", timestamp: "10:30 AM" },
  {
    id: 2,
    text: "I'm doing great, thanks for asking!",
    sender: "user",
    timestamp: "10:31 AM",
  },
  {
    id: 3,
    text: "That's awesome! Want to grab coffee?",
    sender: "other",
    timestamp: "10:32 AM",
  },
  {
    id: 4,
    text: "Sure! When are you free?",
    sender: "user",
    timestamp: "10:33 AM",
  },
];

export default function Page() {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold text-sm">shadcn</h2>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 px-4 py-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t px-4 py-3 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button size="icon" className="rounded-full">
          <SendIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
