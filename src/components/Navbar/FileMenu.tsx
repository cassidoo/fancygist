import type { ReactNode } from "react";
import Dropdown from "../Dropdown";

interface FileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	trigger: ReactNode;
	onNew: () => void;
	onOpen: () => void;
	onCreatePublicCopy: () => void;
	canOpen: boolean;
	showVisibilityCheckbox: boolean;
	canCreatePublicCopy: boolean;
	filename: string;
	onFilenameChange: (value: string) => void;
	isPublic: boolean;
	onVisibilityChange: (value: boolean) => void;
	canUncheckBeforeFirstSave: boolean;
}

export default function FileMenu({
	isOpen,
	onClose,
	trigger,
	onNew,
	onOpen,
	onCreatePublicCopy,
	canOpen,
	showVisibilityCheckbox,
	canCreatePublicCopy,
	filename,
	onFilenameChange,
	isPublic,
	onVisibilityChange,
	canUncheckBeforeFirstSave,
}: FileMenuProps) {
	return (
		<Dropdown
			isOpen={isOpen}
			onClose={onClose}
			trigger={trigger}
			panelClassName="w-full sm:w-80 bg-white rounded-md shadow-md py-2 border border-gray-200"
			panelPositionClassName="sm:left-0 sm:mt-2"
			panelOriginClassName="origin-top sm:origin-top-left"
		>
			<div>
				<button
					onClick={() => {
						onClose();
						onNew();
					}}
					className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
				>
					New gist
				</button>
				{canOpen && (
					<button
						onClick={() => {
							onClose();
							onOpen();
						}}
						className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
					>
						Open gist
					</button>
				)}
			</div>
			<div className="my-2 border-t border-gray-200" />
			<div className="px-3 pb-2 space-y-3">
				<div>
					<label
						htmlFor="file-name-input"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						File name
					</label>
					<input
						id="file-name-input"
						type="text"
						value={filename}
						onChange={(e) => onFilenameChange(e.target.value)}
						className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
						placeholder="filename.md"
						aria-label="Filename"
					/>
				</div>
				{showVisibilityCheckbox && (
					<div className="space-y-1">
						<label className="flex items-center gap-2 text-sm text-gray-700">
							<input
								type="checkbox"
								checked={isPublic}
								onChange={(e) => onVisibilityChange(e.target.checked)}
								className="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-gray-300"
							/>
							Public gist (unchecked = secret)
						</label>
						{canUncheckBeforeFirstSave && isPublic && (
							<p className="text-xs text-gray-500">
								You can uncheck this before your first save.
							</p>
						)}
					</div>
				)}
				{canCreatePublicCopy && (
					<div className="space-y-1">
						<button
							onClick={() => {
								onClose();
								onCreatePublicCopy();
							}}
							className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
						>
							New public gist from this secret gist
						</button>
						<p className="text-xs text-gray-500">
							This keeps the current gist secret and creates a new public copy.
						</p>
					</div>
				)}
			</div>
		</Dropdown>
	);
}
