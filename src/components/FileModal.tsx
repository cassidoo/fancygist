import { motion, AnimatePresence } from "framer-motion";

interface FileModalProps {
	isOpen: boolean;
	onClose: () => void;
	onNew: () => void;
	onOpen: () => void;
	canOpen: boolean;
	filename: string;
	onFilenameChange: (value: string) => void;
}

export default function FileModal({
	isOpen,
	onClose,
	onNew,
	onOpen,
	canOpen,
	filename,
	onFilenameChange,
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
