"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { RadioIcon } from "lucide-react";

export default function RoomInfo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RadioIcon />
        </EmptyMedia>
        <EmptyTitle>Connection</EmptyTitle>
        <EmptyDescription>
          Connection details will appear here when the feature is ready.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
