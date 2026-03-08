import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import {
	Info,
	Save,
	Scroll,
	ScrollText,
	Check,
	X,
	Eye,
	Pencil,
	Link,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IconButton from "../IconButton";
import AboutModal from "../AboutModal";
import DownloadMenu from "./DownloadMenu";
import FileMenu from "./FileMenu";
import UserMenu from "./UserMenu";

interface NavbarProps {
	onNew: () => void;
	onOpen: () => void;
	onCreatePublicCopy: () => void;
	onSave: () => void;
	showVisibilityCheckbox: boolean;
	canCreatePublicCopy: boolean;
	filename: string;
	onFilenameChange: (value: string) => void;
	isPublic: boolean;
	onVisibilityChange: (value: boolean) => void;
	canUncheckBeforeFirstSave: boolean;
	isSaving: boolean;
	saveFeedback: "idle" | "success" | "error";
	hasUnsavedChanges: boolean;
	isPreview: boolean;
	onTogglePreview: () => void;
	gistUrl: string | null;
	onDownloadMarkdown: () => void;
	onDownloadHtml: () => void;
	onDownloadPdf: () => void;
	onBeforeLogin?: () => void;
}

export default function Navbar({
	onNew,
	onOpen,
	onCreatePublicCopy,
	onSave,
	showVisibilityCheckbox,
	canCreatePublicCopy,
	filename,
	onFilenameChange,
	isPublic,
	onVisibilityChange,
	canUncheckBeforeFirstSave,
	isSaving,
	saveFeedback,
	hasUnsavedChanges,
	isPreview,
	onTogglePreview,
	gistUrl,
	onDownloadMarkdown,
	onDownloadHtml,
	onDownloadPdf,
	onBeforeLogin,
}: NavbarProps) {
	const { user, login, logout } = useAuth();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
	const [isAboutOpen, setIsAboutOpen] = useState(false);
	const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);

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
	const saveIconKey = isSaving ? "saving" : saveFeedback;
	const saveIcon = isSaving ? (
		<Save size={18} />
	) : saveFeedback === "success" ? (
		<Check size={18} />
	) : saveFeedback === "error" ? (
		<X size={18} />
	) : (
		<Save size={18} />
	);

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

						<FileMenu
							isOpen={isFileMenuOpen}
							onClose={() => setIsFileMenuOpen(false)}
							trigger={
								<IconButton
									icon={
										hasUnsavedChanges ? (
											<ScrollText size={18} />
										) : (
											<Scroll size={18} />
										)
									}
									label="File"
									onClick={() => setIsFileMenuOpen((prev) => !prev)}
									forceExpanded={isFileMenuOpen}
								/>
							}
							onNew={onNew}
							onOpen={onOpen}
							onCreatePublicCopy={onCreatePublicCopy}
							canOpen={Boolean(user)}
							showVisibilityCheckbox={showVisibilityCheckbox}
							canCreatePublicCopy={canCreatePublicCopy}
							filename={filename}
							onFilenameChange={onFilenameChange}
							isPublic={isPublic}
							onVisibilityChange={onVisibilityChange}
							canUncheckBeforeFirstSave={canUncheckBeforeFirstSave}
						/>

						<IconButton
							icon={isPreview ? <Pencil size={18} /> : <Eye size={18} />}
							label={isPreview ? "Edit" : "Preview"}
							onClick={onTogglePreview}
						/>

						{gistUrl && (
							<IconButton
								icon={<Link size={18} />}
								label="Copy Link"
								onClick={copyShareLink}
							/>
						)}
					</div>

					<div className="flex items-center gap-2">
						{user && (
							<IconButton
								icon={
									<AnimatePresence mode="wait" initial={false}>
										<motion.span
											key={saveIconKey}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.2 }}
											className="flex items-center justify-center"
										>
											{saveIcon}
										</motion.span>
									</AnimatePresence>
								}
								label={saveLabel}
								onClick={onSave}
								disabled={isSaving}
								variant="primary"
								className={
									hasUnsavedChanges ? "" : "bg-gray-400 hover:bg-gray-500"
								}
							/>
						)}

						{user && (
							<DownloadMenu
								isOpen={isDownloadMenuOpen}
								onClose={() => setIsDownloadMenuOpen(false)}
								onToggleOpen={() => setIsDownloadMenuOpen((prev) => !prev)}
								onDownloadMarkdown={onDownloadMarkdown}
								onDownloadHtml={onDownloadHtml}
								onDownloadPdf={onDownloadPdf}
							/>
						)}

						{user ? (
							<UserMenu
								user={user}
								isOpen={isDropdownOpen}
								onClose={() => setIsDropdownOpen(false)}
								onToggleOpen={() => setIsDropdownOpen((prev) => !prev)}
								onLogout={logout}
							/>
						) : (
							<button
								onClick={() => {
									onBeforeLogin?.();
									login();
								}}
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
