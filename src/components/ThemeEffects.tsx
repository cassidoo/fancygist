import { useEffect } from "react";
import { useThemeStore, resolveTheme } from "../hooks/useThemeStore";

export default function ThemeEffects() {
	const preference = useThemeStore((s) => s.preference);
	const systemTheme = useThemeStore((s) => s.systemTheme);
	const setSystemTheme = useThemeStore((s) => s.setSystemTheme);

	// Listen for system theme changes
	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = (e: MediaQueryListEvent) =>
			setSystemTheme(e.matches ? "dark" : "light");
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [setSystemTheme]);

	// Apply .dark class to <html>
	useEffect(() => {
		const resolved = resolveTheme({ preference, systemTheme } as any);
		document.documentElement.classList.toggle("dark", resolved === "dark");
		document.documentElement.style.colorScheme = resolved;
	}, [preference, systemTheme]);

	return null;
}
