import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { motion } from "framer-motion";

interface SplitDownloadButtonProps {
	onDownloadMarkdown: () => void;
	onOpenMenu: () => void;
	menuOpen: boolean;
}

const ICON_SIZE = 36;
const CARET_SIZE = 30;
const GAP = 6;
const PAD_RIGHT = 4;

export default function SplitDownloadButton({
	onDownloadMarkdown,
	onOpenMenu,
	menuOpen,
}: SplitDownloadButtonProps) {
	const [hovered, setHovered] = useState(false);
	const labelRef = useRef<HTMLSpanElement>(null);
	const [labelWidth, setLabelWidth] = useState(0);

	useEffect(() => {
		if (labelRef.current) {
			setLabelWidth(labelRef.current.scrollWidth);
		}
	}, []);

	const expanded = hovered || menuOpen;
	const targetWidth = expanded
		? ICON_SIZE + GAP + labelWidth + PAD_RIGHT + CARET_SIZE
		: ICON_SIZE;
	const spring = { type: "spring" as const, stiffness: 500, damping: 30 };

	return (
		<motion.div
			className={`inline-flex items-center justify-between h-9 rounded-full overflow-hidden text-gray-700 hover:bg-gray-100 ${expanded ? "bg-gray-100" : ""}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			animate={{ width: targetWidth }}
			transition={spring}
			style={{ minWidth: ICON_SIZE }}
		>
			<button
				onClick={onDownloadMarkdown}
				className="inline-flex items-center justify-between h-9 cursor-pointer"
				title="Download"
			>
				<span className="flex-shrink-0 flex items-center justify-center w-9 h-9">
					<Download size={18} />
				</span>
				<motion.span
					ref={labelRef}
					className="text-sm font-medium whitespace-nowrap mr-2"
					animate={{ opacity: expanded ? 1 : 0 }}
					transition={{ duration: expanded ? 0.15 : 0.1 }}
				>
					Download
				</motion.span>
			</button>
			<motion.button
				onClick={(e) => {
					e.stopPropagation();
					onOpenMenu();
				}}
				className={`flex-shrink-0 flex items-center justify-center h-9 w-7 border-l border-gray-200 cursor-pointer hover:bg-gray-200 ${menuOpen ? "bg-gray-200" : ""}`}
				animate={{
					opacity: expanded ? 1 : 0,
					width: expanded ? CARET_SIZE : 0,
				}}
				transition={spring}
				aria-label="More download options"
			>
				<ChevronDown size={14} />
			</motion.button>
		</motion.div>
	);
}
