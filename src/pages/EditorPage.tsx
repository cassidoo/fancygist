import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import MarkdownPreview from "../components/MarkdownPreview";
import Navbar from "../components/Navbar";
import OpenGistModal from "../components/OpenGistModal";
import { useAuth } from "../contexts/AuthContext";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import type { Gist } from "../types";

export default function EditorPage() {
	const { username, gistId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [content, setContent] = useState("");
	const [description, setDescription] = useState("");
	const [filename, setFilename] = useState("untitled.md");
	const [isPreview, setIsPreview] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveFeedback, setSaveFeedback] = useState<
		"idle" | "success" | "error"
	>("idle");
	const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
	const [currentGistId, setCurrentGistId] = useState<string | null>(
		gistId || null,
	);
	const [originalOwner, setOriginalOwner] = useState<string | null>(
		username?.replace(/^@/, "") || null,
	);
	const { hasUnsavedChanges, markDirty, markClean, setupBeforeUnload } =
		useUnsavedChanges();

	// Load gist if URL has gist ID
	useEffect(() => {
		if (gistId) {
			loadGist(gistId);
			setIsPreview(true); // Start in preview mode for shared links
		}
	}, [gistId]);

	// Setup beforeunload listener
	useEffect(() => {
		return setupBeforeUnload();
	}, [setupBeforeUnload]);

	useEffect(() => {
		if (saveFeedback === "idle") return;
		const timeoutId = window.setTimeout(() => setSaveFeedback("idle"), 1200);
		return () => window.clearTimeout(timeoutId);
	}, [saveFeedback]);

	const loadGist = async (id: string) => {
		try {
			const response = await fetch(`/api/gists/${id}`);
			if (!response.ok) throw new Error("Failed to load gist");

			const gist: Gist = await response.json();
			const mdFile = Object.values(gist.files).find(
				(f) => f.filename.endsWith(".md") || f.filename.endsWith(".markdown"),
			);

			if (mdFile && mdFile.content) {
				setContent(mdFile.content);
				setFilename(mdFile.filename);
				setDescription(gist.description || "");
				setOriginalOwner(gist.owner.login);
				setCurrentGistId(id);
				markClean();
			}
		} catch (error) {
			console.error("Error loading gist:", error);
			alert("Failed to load gist");
		}
	};

	const handleSave = async () => {
		if (!user) {
			alert("Please log in to save");
			return;
		}

		setSaveFeedback("idle");
		setIsSaving(true);
		try {
			const isOwner = originalOwner === user.login;
			const endpoint =
				currentGistId && isOwner
					? `/api/gists/${currentGistId}`
					: "/api/gist-create";

			const method = currentGistId && isOwner ? "PATCH" : "POST";

			const response = await fetch(endpoint, {
				method,
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					description,
					files: {
						[filename]: { content },
					},
					public: true,
				}),
			});

			if (!response.ok) throw new Error("Failed to save gist");

			const savedGist: Gist = await response.json();
			setCurrentGistId(savedGist.id);
			setOriginalOwner(user.login);
			markClean();
			setSaveFeedback("success");

			// Update URL without reload
			window.history.pushState({}, "", `/@${user.login}/${savedGist.id}`);
		} catch (error) {
			console.error("Error saving gist:", error);
			setSaveFeedback("error");
			alert("Failed to save gist");
		} finally {
			setIsSaving(false);
		}
	};

	const handleNew = () => {
		if (hasUnsavedChanges && !confirm("You have unsaved changes. Continue?")) {
			return;
		}
		setContent("");
		setDescription("");
		setFilename("untitled.md");
		setCurrentGistId(null);
		setOriginalOwner(null);
		setIsPreview(false);
		markClean();
		window.history.pushState({}, "", "/");
	};

	const handleContentChange = (value: string) => {
		setContent(value);
		markDirty();
	};

	const handleDownload = () => {
		const blob = new Blob([content], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleOpenGist = () => {
		if (!user) {
			alert("Please log in to open gists");
			return;
		}
		setIsOpenModalOpen(true);
	};

	const handleSelectGist = async (gistId: string, owner: string) => {
		// Check for unsaved changes
		if (hasUnsavedChanges) {
			const confirmMessage =
				"You have unsaved changes. Do you want to discard them and open this gist?";
			if (!confirm(confirmMessage)) {
				return;
			}
		}

		// Load the selected gist
		await loadGist(gistId);
		setIsPreview(true);
		navigate(`/@${owner}/${gistId}`);
	};

	// Keyboard shortcuts
	useKeyboardShortcut("s", handleSave, { ctrl: true });
	useKeyboardShortcut("k", handleNew, { ctrl: true, shift: true });
	useKeyboardShortcut("o", handleOpenGist, { ctrl: true, shift: true });
	useKeyboardShortcut("p", () => setIsPreview((prev) => !prev), {
		ctrl: true,
		shift: true,
	});

	const isOwner = user && originalOwner === user.login;

	return (
		<div className="h-screen flex flex-col">
			<Navbar
				onNew={handleNew}
				onOpen={handleOpenGist}
				onSave={handleSave}
				isSaving={isSaving}
				saveFeedback={saveFeedback}
				hasUnsavedChanges={hasUnsavedChanges}
				isPreview={isPreview}
				onTogglePreview={() => setIsPreview(!isPreview)}
				isOwner={isOwner || false}
				gistUrl={
					currentGistId && originalOwner
						? `/@${originalOwner}/${currentGistId}`
						: null
				}
				onDownload={handleDownload}
			/>

			<OpenGistModal
				isOpen={isOpenModalOpen}
				onClose={() => setIsOpenModalOpen(false)}
				onSelectGist={handleSelectGist}
			/>

			<div className="flex-1 overflow-hidden">
				{isPreview ? (
					<MarkdownPreview content={content} />
				) : (
					<Editor value={content} onChange={handleContentChange} />
				)}
			</div>
		</div>
	);
}
