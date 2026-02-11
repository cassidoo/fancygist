import { motion, AnimatePresence } from "framer-motion";

interface AboutModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
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
							className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
							style={{ transformOrigin: "top center" }}
							initial={{ rotateX: -90, opacity: 0 }}
							animate={{ rotateX: 0, opacity: 1 }}
							exit={{ rotateX: -90, opacity: 0 }}
							transition={spring}
							onClick={(e) => e.stopPropagation()}
						>
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								About FancyGist
							</h2>
							<p className="text-sm text-gray-600 mb-4">
								Beautiful Markdown GitHub Gists.
							</p>
							<div className="text-xs text-gray-500">
								<p>How to use:</p>
								<ul className="list-disc list-inside mt-1 text-gray-500">
									<li>Just start typing in markdown.</li>
									<li>
										Start a line with{" "}
										<code className="bg-gray-100 px-1 rounded">/</code> for
										commands to insert code blocks, images, etc.
									</li>
									<li>
										When you hit "save", your gist will be created and you can
										copy the link to share it!
									</li>
								</ul>
							</div>
							<button
								onClick={onClose}
								className="mt-5 w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
							>
								Close
							</button>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
