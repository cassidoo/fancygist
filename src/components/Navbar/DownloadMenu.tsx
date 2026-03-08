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
			panelClassName="w-full sm:w-44 bg-white rounded-md shadow-md py-1 border border-gray-200"
		>
			<button
				onClick={() => {
					onClose();
					onDownloadHtml();
				}}
				className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
			>
				Download as HTML
			</button>
			<button
				onClick={() => {
					onClose();
					onDownloadPdf();
				}}
				className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
			>
				Download as PDF
			</button>
		</Dropdown>
	);
}
