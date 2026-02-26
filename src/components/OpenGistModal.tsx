import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Gist } from "../types";

interface OpenGistModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectGist: (gistId: string, owner: string) => void;
}

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };
const GISTS_CACHE_KEY = "fancygist-open-modal-gists-cache";
const GISTS_CACHE_TTL_MS = 2 * 60 * 1000;

interface GistsCacheData {
	timestamp: number;
	gists: Gist[];
}

export default function OpenGistModal({
	isOpen,
	onClose,
	onSelectGist,
}: OpenGistModalProps) {
	const [gists, setGists] = useState<Gist[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			fetchGists();
		}
	}, [isOpen]);

	const getCachedGists = (): Gist[] | null => {
		try {
			const cached = localStorage.getItem(GISTS_CACHE_KEY);
			if (!cached) return null;
			const parsed: GistsCacheData = JSON.parse(cached);
			if (
				!Array.isArray(parsed.gists) ||
				typeof parsed.timestamp !== "number"
			) {
				localStorage.removeItem(GISTS_CACHE_KEY);
				return null;
			}
			if (Date.now() - parsed.timestamp > GISTS_CACHE_TTL_MS) {
				localStorage.removeItem(GISTS_CACHE_KEY);
				return null;
			}
			return parsed.gists;
		} catch (err) {
			console.warn("Error reading gists cache:", err);
			localStorage.removeItem(GISTS_CACHE_KEY);
			return null;
		}
	};

	const setCachedGists = (nextGists: Gist[]) => {
		try {
			const cacheData: GistsCacheData = {
				timestamp: Date.now(),
				gists: nextGists,
			};
			localStorage.setItem(GISTS_CACHE_KEY, JSON.stringify(cacheData));
		} catch (err) {
			console.warn("Error writing gists cache:", err);
		}
	};

	const fetchGists = async (forceRefresh = false) => {
		setError(null);
		if (!forceRefresh) {
			const cachedGists = getCachedGists();
			if (cachedGists) {
				setGists(cachedGists);
				setLoading(false);
				return;
			}
		}

		setLoading(true);
		try {
			const response = await fetch("/api/user/gists", {
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to fetch gists");
			}

			const data: Gist[] = await response.json();
			setGists(data);
			setCachedGists(data);
		} catch (err) {
			console.error("Error fetching gists:", err);
			setError("Failed to load your gists. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleSelectGist = (gist: Gist) => {
		onSelectGist(gist.id, gist.owner.login);
		onClose();
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return "Today";
		} else if (diffDays === 1) {
			return "Yesterday";
		} else if (diffDays < 7) {
			return `${diffDays} days ago`;
		} else {
			return date.toLocaleDateString();
		}
	};

	const getMarkdownFilename = (gist: Gist): string => {
		const mdFile = Object.values(gist.files).find(
			(f) => f.filename.endsWith(".md") || f.filename.endsWith(".markdown"),
		);
		return mdFile?.filename || "Untitled gist";
	};

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
							className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[600px] flex flex-col"
							style={{ transformOrigin: "top center" }}
							initial={{ rotateX: -90, opacity: 0 }}
							animate={{ rotateX: 0, opacity: 1 }}
							exit={{ rotateX: -90, opacity: 0 }}
							transition={spring}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-6 border-b border-gray-200">
								<h2 className="text-xl font-semibold text-gray-900">
									Open gist
								</h2>
								<p className="text-sm text-gray-600 mt-1">
									Select a gist to open
								</p>
							</div>

							<div className="flex-1 overflow-y-auto p-6">
								{loading && (
									<div className="flex items-center justify-center py-12">
										<Loader2 className="animate-spin text-gray-400" size={32} />
									</div>
								)}

								{error && (
									<div className="text-center py-12">
										<p className="text-red-600 text-sm">{error}</p>
										<button
											onClick={() => fetchGists(true)}
											className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
										>
											Retry
										</button>
									</div>
								)}

								{!loading && !error && gists.length === 0 && (
									<div className="text-center py-12">
										<p className="text-gray-500 text-sm">
											No markdown gists found.
										</p>
										<p className="text-gray-400 text-xs mt-2">
											Create a new gist to get started!
										</p>
									</div>
								)}

								{!loading && !error && gists.length > 0 && (
									<div className="space-y-2">
										{gists.map((gist) => (
											<button
												key={gist.id}
												onClick={() => handleSelectGist(gist)}
												className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer group"
											>
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1 min-w-0">
														<p className="font-medium text-gray-900 truncate group-hover:text-gray-700">
															{getMarkdownFilename(gist)}
														</p>
														<p className="text-sm text-gray-500 mt-1">
															{gist.description || "No description"}
														</p>
													</div>
													<div className="text-xs text-gray-400 whitespace-nowrap">
														{formatDate(gist.updated_at)}
													</div>
												</div>
											</button>
										))}
									</div>
								)}
							</div>

							<div className="p-6 border-t border-gray-200">
								<button
									onClick={onClose}
									className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
								>
									Cancel
								</button>
							</div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
