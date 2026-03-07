import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SlashCommand } from "./SlashCommands";

interface CommandMenuProps {
	commands: SlashCommand[];
	selectedIndex: number;
	onSelect: (command: SlashCommand) => void;
	onClose: () => void;
	displayPrefix?: string;
}

export default function CommandMenu({
	commands,
	selectedIndex,
	onSelect,
	onClose,
	displayPrefix = "/",
}: CommandMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	useEffect(() => {
		if (menuRef.current) {
			const selectedElement = menuRef.current.children[
				selectedIndex
			] as HTMLElement;
			if (selectedElement) {
				selectedElement.scrollIntoView({ block: "nearest" });
			}
		}
	}, [selectedIndex]);

	const show = commands.length > 0;

	return (
		<AnimatePresence>
			{show && (
				<div className="slash-command-menu-positioner fixed w-60 max-w-fit h-min [perspective:600px]">
					<motion.div
						ref={menuRef}
						className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 max-h-64 max-w-64 overflow-y-auto z-50"
						style={{ transformOrigin: "top left" }}
						initial={{ rotateY: -70, opacity: 0 }}
						animate={{ rotateY: 0, opacity: 1 }}
						exit={{ rotateY: -70, opacity: 0 }}
						transition={{ type: "spring", stiffness: 500, damping: 30 }}
					>
						{commands.map((command, index) => (
							<button
								key={command.label}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => onSelect(command)}
								className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer ${
									index === selectedIndex
										? "bg-gray-50 border-l-2 border-lime-600"
										: "border-l-2 border-l-transparent"
								}`}
							>
								<div className="font-medium text-sm text-gray-900">
									{displayPrefix}
									{command.label}
								</div>
								<div className="text-xs text-gray-500">
									{command.description}
								</div>
							</button>
						))}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}

export { slashCommands, type SlashCommand } from "./SlashCommands";
export { getEmojiCommands } from "./EmojiCommands";
