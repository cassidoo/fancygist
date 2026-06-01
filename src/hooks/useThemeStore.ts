import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemePreference = "system" | "light" | "dark";

interface ThemeState {
	preference: ThemePreference;
	systemTheme: "light" | "dark";
	setPreference: (pref: ThemePreference) => void;
	setSystemTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			preference: "system",
			systemTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light",
			setPreference: (preference) => set({ preference }),
			setSystemTheme: (systemTheme) => set({ systemTheme }),
		}),
		{
			name: "fancygist-theme",
			partialize: (state) => ({ preference: state.preference }),
		},
	),
);

export function resolveTheme(state: ThemeState): "light" | "dark" {
	return state.preference === "system" ? state.systemTheme : state.preference;
}

export function useResolvedTheme(): "light" | "dark" {
	return useThemeStore((s) => resolveTheme(s));
}
