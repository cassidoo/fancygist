import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

interface NavbarProps {
	onNew: () => void;
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

	const copyShareLink = () => {
		if (gistUrl) {
			const url = `${window.location.origin}${gistUrl}`;
			navigator.clipboard.writeText(url);
			alert("Link copied to clipboard!");
		}
	};

	return (
		<nav className="bg-white px-4 py-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<a href="/" className="text-xl font-semibold text-gray-900">
						FancyGist
					</a>

					<div className="flex items-center gap-2">
						<button
							onClick={onNew}
							className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
						>
							New
						</button>

						{showEditButton && (
							<button
								onClick={onTogglePreview}
								className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
							>
								{isPreview ? "Edit" : "Preview"}
							</button>
						)}

						{gistUrl && (
							<button
								onClick={copyShareLink}
								className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
							>
								Copy Link
							</button>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2">
					{user && !isPreview && (
						<>
							<button
								onClick={onSave}
								disabled={isSaving}
								className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
							>
								{isSaving ? "Saving..." : "Save"}
								{hasUnsavedChanges && !isSaving && " *"}
							</button>
							<button
								onClick={onDownload}
								className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
							>
								Download
							</button>
						</>
					)}

					{user ? (
						<div className="relative">
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center gap-2 hover:opacity-80 transition-opacity"
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
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
										<a
											href={`https://github.com/${user.login}`}
											target="_blank"
											rel="noopener noreferrer"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											GitHub Profile
										</a>
										<a
											href={`https://gist.github.com/${user.login}`}
											target="_blank"
											rel="noopener noreferrer"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											GitHub Gists
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
									</div>
								</>
							)}
						</div>
					) : (
						<button
							onClick={login}
							className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded"
						>
							Login with GitHub
						</button>
					)}
				</div>
			</div>
		</nav>
	);
}
