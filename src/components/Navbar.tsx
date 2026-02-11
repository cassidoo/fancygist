import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { Info, Plus, Save, Download, Eye, Pencil, Link, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IconButton from "./IconButton";
import AboutModal from "./AboutModal";

interface NavbarProps {
	onNew: () => void;
	onOpen: () => void;
	onSave: () => void;
	isSaving: boolean;
	hasUnsavedChanges: boolean;
	isPreview: boolean;
	onTogglePreview: () => void;
	showEditButton: boolean;
	isOwner: boolean;
	gistUrl: string | null;
	onDownload: () => void;
}

export default function Navbar({
	onNew,
	onOpen,
	onSave,
	isSaving,
	hasUnsavedChanges,
	isPreview,
	onTogglePreview,
	showEditButton,
	gistUrl,
	onDownload,
}: NavbarProps) {
	const { user, login, logout } = useAuth();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAboutOpen, setIsAboutOpen] = useState(false);

	const copyShareLink = () => {
		if (gistUrl) {
			const url = `${window.location.origin}${gistUrl}`;
			navigator.clipboard.writeText(url);
			alert("Link copied to clipboard!");
		}
	};

	const saveLabel = isSaving
		? "Saving…"
		: `Save${hasUnsavedChanges ? " *" : ""}`;

	return (
		<>
			<nav className="bg-white px-4 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<IconButton
							icon={<Info size={18} />}
							label="About FancyGist"
							onClick={() => setIsAboutOpen(true)}
						/>

						<IconButton icon={<Plus size={18} />} label="New" onClick={onNew} />

						{user && (
							<IconButton
								icon={<FolderOpen size={18} />}
								label="Open"
								onClick={onOpen}
							/>
						)}

						{showEditButton && (
							<IconButton
								icon={isPreview ? <Pencil size={18} /> : <Eye size={18} />}
								label={isPreview ? "Edit" : "Preview"}
								onClick={onTogglePreview}
							/>
						)}

						{gistUrl && (
							<IconButton
								icon={<Link size={18} />}
								label="Copy Link"
								onClick={copyShareLink}
							/>
						)}
					</div>

					<div className="flex items-center gap-2">
						{user && !isPreview && (
							<>
								<IconButton
									icon={<Save size={18} />}
									label={saveLabel}
									onClick={onSave}
									disabled={isSaving}
									variant="primary"
								/>
								<IconButton
									icon={<Download size={18} />}
									label="Download"
									onClick={onDownload}
								/>
							</>
						)}

						{user ? (
							<div className="relative">
								<button
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
								>
									<img
										src={user.avatar_url}
										alt={user.login}
										className="w-8 h-8 rounded-full"
									/>
								</button>

								{isDropdownOpen && (
									<>
										<div
											className="fixed inset-0 z-10"
											onClick={() => setIsDropdownOpen(false)}
										/>
									</>
								)}
								<div
									className="absolute right-0 z-10 mt-2"
									style={{ perspective: 600 }}
								>
									<AnimatePresence>
										{isDropdownOpen && (
											<motion.div
												className="w-48 bg-white rounded-md shadow-md py-1 z-20 border border-gray-200"
												style={{ transformOrigin: "top right" }}
												initial={{ scale: 0.7, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												exit={{ scale: 0.7, opacity: 0 }}
												transition={{
													type: "spring",
													stiffness: 500,
													damping: 30,
												}}
											>
												<div className="px-4 py-2 pb-3 text-xs text-gray-700 border-b border-gray-200">
													Logged in as {user.login}
												</div>
												<a
													href={`https://github.com/${user.login}`}
													target="_blank"
													rel="noopener noreferrer"
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												>
													Your GitHub
												</a>
												<a
													href={`https://gist.github.com/${user.login}`}
													target="_blank"
													rel="noopener noreferrer"
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												>
													Your Gists
												</a>
												<button
													onClick={() => {
														setIsDropdownOpen(false);
														logout();
													}}
													className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												>
													Logout
												</button>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						) : (
							<button
								onClick={login}
								className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded cursor-pointer"
							>
								Login with GitHub
							</button>
						)}
					</div>
				</div>
			</nav>

			<AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
		</>
	);
}
