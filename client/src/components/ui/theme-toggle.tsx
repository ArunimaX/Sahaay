import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`
        relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue
        ${isDark ? "bg-slate-800" : "bg-sky-200"}
      `}
            aria-label="Toggle Dark Mode"
        >
            <span className="sr-only">Toggle Dark Mode</span>
            <div
                className={`
          absolute left-1 top-1 flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300
          ${isDark ? "translate-x-8" : "translate-x-0"}
        `}
            >
                {isDark ? (
                    <Moon className="h-4 w-4 text-slate-800" />
                ) : (
                    <Sun className="h-4 w-4 text-orange-500" />
                )}
            </div>

            {/* Background Icons for visual flair */}
            <div className="absolute left-2 text-yellow-600 opacity-50">
                {!isDark && <Sun className="h-4 w-4 opacity-0" />}
            </div>
            <div className="absolute right-2 text-slate-400 opacity-50">
                {isDark && <Moon className="h-4 w-4 opacity-0" />}
            </div>
        </button>
    );
}
