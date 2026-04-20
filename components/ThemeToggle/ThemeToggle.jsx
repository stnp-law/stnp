"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder of the same size to avoid layout shift
    return <div className={styles.toggleSpacer} />;
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  return (
    <button
      className={styles.toggleButton}
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
    >
      <div className={`${styles.iconContainer} ${isDark ? styles.isDark : styles.isLight}`}>
        <Sun className={styles.sunIcon} weight="light" />
        <Moon className={styles.moonIcon} weight="light" />
      </div>
    </button>
  );
}
