import { Eye, Pencil, Monitor, Sun, Moon } from "lucide-react";
import IconButton from "../IconButton";
import Dropdown from "../Dropdown";
import { useThemeStore, useResolvedTheme } from "../../hooks/useThemeStore";
import type { ReactNode } from "react";

interface ViewMenuProps {
	isOpen: boolean;
	onClose: () => void;
	onToggleOpen: () => void;
	isPreview: boolean;
	onTogglePreview: () => void;
}

const isMac =
	typeof navigator !== "undefined" &&
	/Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

function MenuItem({
	icon,
	label,
	hint,
	active,
	onClick,
}: {
	icon: ReactNode;
	label: string;
	hint?: string;
	active?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`flex w-full items-center gap-3 px-4 py-2 text-sm cursor-pointer transition-colors ${
				active
					? "text-lime-700 dark:text-lime-400 bg-gray-50 dark:bg-gray-700/50"
					: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
			}`}
		>
			<span className="flex-shrink-0 w-4 flex items-center justify-center">
				{icon}
			</span>
			<span className="flex-1 text-left">{label}</span>
			{hint && (
				<span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
					{hint}
				</span>
			)}
		</button>
	);
}

export default function ViewMenu({
	isOpen,
	onClose,
	onToggleOpen,
	isPreview,
	onTogglePreview,
}: ViewMenuProps) {
	const preference = useThemeStore((s) => s.preference);
	const setPreference = useThemeStore((s) => s.setPreference);
	const resolvedTheme = useResolvedTheme();

	const previewHint = isMac ? "⌘⇧P" : "Ctrl+Shift+P";

	return (
		<Dropdown
			isOpen={isOpen}
			onClose={onClose}
			trigger={
				<IconButton
					icon={
						isPreview ? <Pencil size={18} /> : <Eye size={18} />
					}
					label="View"
					onClick={onToggleOpen}
					forceExpanded={isOpen}
				/>
			}
			panelClassName="w-full sm:w-56 bg-white dark:bg-gray-800 rounded-md shadow-md py-1 border border-gray-200 dark:border-gray-700"
			panelPositionClassName="sm:left-0 sm:mt-2"
			panelOriginClassName="origin-top sm:origin-top-left"
		>
			<MenuItem
				icon={isPreview ? <Pencil size={14} /> : <Eye size={14} />}
				label={isPreview ? "Edit" : "Preview"}
				hint={previewHint}
				onClick={() => {
					onTogglePreview();
					onClose();
				}}
			/>

			<div className="my-1 border-t border-gray-200 dark:border-gray-700" />

			<div className="px-4 py-1.5">
				<span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
					Theme
				</span>
			</div>

			<MenuItem
				icon={<Monitor size={14} />}
				label="System"
				active={preference === "system"}
				onClick={() => setPreference("system")}
			/>
			<MenuItem
				icon={<Sun size={14} />}
				label="Light"
				active={preference === "light"}
				onClick={() => setPreference("light")}
			/>
			<MenuItem
				icon={<Moon size={14} />}
				label="Dark"
				active={preference === "dark"}
				onClick={() => setPreference("dark")}
			/>

			{preference === "system" && (
				<div className="px-4 py-1.5">
					<span className="text-xs text-gray-400 dark:text-gray-500">
						Currently: {resolvedTheme === "dark" ? "Dark" : "Light"}
					</span>
				</div>
			)}
		</Dropdown>
	);
}
