import { format, isSameYear, isToday, isYesterday } from "date-fns";
import type { MessageWithSender } from "@/features/chat/types";

export interface MessageDateGroup {
  dateLabel: string;
  messages: MessageWithSender[];
}

function formatDateLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isSameYear(date, new Date())) return format(date, "EEEE, MMMM d");
  return format(date, "MMMM d, yyyy");
}

export function groupMessagesByDate(
  messages: MessageWithSender[],
): MessageDateGroup[] {
  const groups: MessageDateGroup[] = [];
  let lastDate = new Date(0).toDateString();

  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt);
    // We can't compare objects directly because they are different instances, so we compare their string representations instead
    const msgDatePrimitive = msgDate.toDateString();

    if (msgDatePrimitive !== lastDate) {
      groups.push({
        messages: [msg],
        dateLabel: formatDateLabel(msgDate),
      })
      lastDate = msgDatePrimitive;
    } else {
      groups.at(-1)?.messages.push(msg)
    }

  })
  return groups;
}
