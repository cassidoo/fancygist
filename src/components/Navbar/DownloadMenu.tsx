import Dropdown from "../Dropdown";
import SplitDownloadButton from "./SplitDownloadButton";

interface DownloadMenuProps {
	isOpen: boolean;
	onClose: () => void;
	onToggleOpen: () => void;
	onDownloadMarkdown: () => void;
	onDownloadHtml: () => void;
	onDownloadPdf: () => void;
}

export default function DownloadMenu({
	isOpen,
	onClose,
	onToggleOpen,
	onDownloadMarkdown,
	onDownloadHtml,
	onDownloadPdf,
}: DownloadMenuProps) {
	return (
		<Dropdown
			isOpen={isOpen}
			onClose={onClose}
			trigger={
				<SplitDownloadButton
					onDownloadMarkdown={onDownloadMarkdown}
					onOpenMenu={onToggleOpen}
					menuOpen={isOpen}
				/>
			}
			panelClassName="w-full sm:w-44 bg-white dark:bg-neutral-800 rounded-md shadow-md py-1 border border-gray-200 dark:border-neutral-700"
		>
			<button
				onClick={() => {
					onClose();
					onDownloadHtml();
				}}
				className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
			>
				Download as HTML
			</button>
			<button
				onClick={() => {
					onClose();
					onDownloadPdf();
				}}
				className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
			>
				Download as PDF
			</button>
		</Dropdown>
	);
}
