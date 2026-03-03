import { motion, AnimatePresence } from "framer-motion";

interface FileModalProps {
	isOpen: boolean;
	onClose: () => void;
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

export default function FileModal({
	isOpen,
	onClose,
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
}: FileModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						className="fixed inset-0 bg-black/30 z-40"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={onClose}
					/>
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
						style={{ perspective: 800 }}
						onClick={onClose}
					>
						<motion.div
							className="bg-white rounded-2xl shadow-xl max-w-md w-full flex flex-col"
							style={{ transformOrigin: "top center" }}
							initial={{ rotateX: -90, opacity: 0 }}
							animate={{ rotateX: 0, opacity: 1 }}
							exit={{ rotateX: -90, opacity: 0 }}
							transition={{ type: "spring", stiffness: 400, damping: 30 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-6 border-b border-gray-200">
								<h2 className="text-xl font-semibold text-gray-900">File</h2>
								<p className="text-sm text-gray-600 mt-1">
									Create, open, or rename your markdown file
								</p>
							</div>
							<div className="p-6 space-y-4">
								<button
									onClick={() => {
										onClose();
										onNew();
									}}
									className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
								>
									New file
								</button>
								{canOpen && (
									<button
										onClick={() => {
											onClose();
											onOpen();
										}}
										className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
									>
										Open gist
									</button>
								)}

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
										className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
										placeholder="filename.md"
										aria-label="Filename"
									/>
								</div>
								{showVisibilityCheckbox && (
									<>
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
									</>
								)}
								{canCreatePublicCopy && (
									<>
										<button
											onClick={() => {
												onClose();
												onCreatePublicCopy();
											}}
											className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
										>
											Create new public gist from this secret gist
										</button>
										<p className="text-xs text-gray-500">
											This keeps the current gist secret and creates a new public copy.
										</p>
									</>
								)}
							</div>
							<div className="p-6 border-t border-gray-200">
								<button
									onClick={onClose}
									className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
								>
									Close
								</button>
							</div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
