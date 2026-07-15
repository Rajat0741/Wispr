"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaCircleHalfStroke } from "react-icons/fa6";
import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Toggle
      aria-label="Toggle Theme"
      pressed={mounted ? resolvedTheme === "dark" : false}
      onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
      disabled={!mounted}
    >
      <FaCircleHalfStroke />
    </Toggle>
  );
}
