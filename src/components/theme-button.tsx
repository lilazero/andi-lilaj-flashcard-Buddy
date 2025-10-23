"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCycle = () => {
    const next = { light: "dark", dark: "system", system: "light" }[
      //to be sure
      theme ?? "system"
    ] as string;
    setTheme(next);
  };

  //because the theme is undefined at first, the icon currentTheme is undefined
  // and doesn't know what icon to choose and it freaks out and gets a hydration error
  if (!mounted) return <Button variant="outline" size="icon" />;

  const currentTheme = theme === "system" ? "system" : resolvedTheme ?? theme;

  return (
    <Button variant="outline" size="icon" onClick={handleCycle}>
      {currentTheme === "light" && <Sun />}
      {currentTheme === "dark" && <Moon />}
      {currentTheme === "system" && <Monitor />}
    </Button>
  );
}
