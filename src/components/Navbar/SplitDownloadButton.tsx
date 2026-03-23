import { Download, ChevronDown } from "lucide-react";
import Tooltip from "../Tooltip";

interface SplitDownloadButtonProps {
	onDownloadMarkdown: () => void;
	onOpenMenu: () => void;
	menuOpen: boolean;
}

export default function SplitDownloadButton({
	onDownloadMarkdown,
	onOpenMenu,
	menuOpen,
}: SplitDownloadButtonProps) {
	return (
		<Tooltip label="Download">
			<div
				className={`inline-flex items-center h-9 rounded-full overflow-hidden text-gray-700 transition-colors hover:bg-gray-100 ${menuOpen ? "bg-gray-100" : ""}`}
			>
				<button
					onClick={onDownloadMarkdown}
					className="inline-flex items-center justify-center w-9 h-9 cursor-pointer"
					aria-label="Download Markdown"
				>
					<Download size={18} />
				</button>
				<button
					onClick={(e) => {
						e.stopPropagation();
						onOpenMenu();
					}}
					className={`flex items-center justify-center h-9 w-7 border-l border-gray-200 cursor-pointer hover:bg-gray-200 ${menuOpen ? "bg-gray-200" : ""}`}
					aria-label="More download options"
				>
					<ChevronDown size={14} />
				</button>
			</div>
		</Tooltip>
	);
}
