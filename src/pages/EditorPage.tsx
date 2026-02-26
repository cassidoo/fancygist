import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import MarkdownPreview from "../components/MarkdownPreview";
import Navbar from "../components/Navbar";
import OpenGistModal from "../components/OpenGistModal";
import { useAuth } from "../contexts/AuthContext";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import {
	DEFAULT_MARKDOWN_FILENAME,
	deriveMarkdownFilenameFromContent,
	normalizeMarkdownFilename,
} from "../utils/filename";
import type { Gist } from "../types";

export default function EditorPage() {
	const { username, gistId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [content, setContent] = useState("");
	const [description, setDescription] = useState("");
	const [filename, setFilename] = useState(DEFAULT_MARKDOWN_FILENAME);
	const [originalFilename, setOriginalFilename] = useState<string | null>(null);
	const [isFilenameManuallyEdited, setIsFilenameManuallyEdited] = useState(false);
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
				setOriginalFilename(mdFile.filename);
				setIsFilenameManuallyEdited(true);
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
		const filenameToSave =
			filename.trim().length > 0
				? filename
				: originalFilename || deriveMarkdownFilenameFromContent(content);
		const normalizedFilename = normalizeMarkdownFilename(filenameToSave);
		const isOwner = originalOwner === user.login;
			const endpoint =
				currentGistId && isOwner
					? `/api/gists/${currentGistId}`
					: "/api/gists/create";

			const method = currentGistId && isOwner ? "PATCH" : "POST";
			const files: Record<string, { content: string } | null> = {};

			if (
				currentGistId &&
				isOwner &&
				originalFilename &&
				originalFilename !== normalizedFilename
			) {
				files[originalFilename] = null;
			}
			files[normalizedFilename] = { content };

			const response = await fetch(endpoint, {
				method,
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					description,
					files,
					public: true,
				}),
			});

			if (!response.ok) throw new Error("Failed to save gist");

			const savedGist: Gist = await response.json();
			setCurrentGistId(savedGist.id);
			setOriginalOwner(user.login);
			setFilename(normalizedFilename);
			setOriginalFilename(normalizedFilename);
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
		setFilename(DEFAULT_MARKDOWN_FILENAME);
		setOriginalFilename(null);
		setIsFilenameManuallyEdited(false);
		setCurrentGistId(null);
		setOriginalOwner(null);
		setIsPreview(false);
		markClean();
		window.history.pushState({}, "", "/");
	};

	const handleContentChange = (value: string) => {
		setContent(value);
		if (!currentGistId && !isFilenameManuallyEdited) {
			setFilename(deriveMarkdownFilenameFromContent(value));
		}
		markDirty();
	};

	const handleFilenameChange = (value: string) => {
		setFilename(value);
		setIsFilenameManuallyEdited(true);
		markDirty();
	};

	const handleDownload = () => {
		const markdownFilename = normalizeMarkdownFilename(filename);
		const blob = new Blob([content], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = markdownFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const getPreviewElement = () =>
		document.querySelector(".markdown-preview") as HTMLElement | null;

	const waitForPreviewElement = async () => {
		for (let i = 0; i < 10; i += 1) {
			const previewElement = getPreviewElement();
			if (previewElement) return previewElement;
			await new Promise<void>((resolve) => {
				window.requestAnimationFrame(() => resolve());
			});
		}
		return null;
	};

	const getBaseFilename = () =>
		normalizeMarkdownFilename(filename).replace(/\.(md|markdown)$/i, "") ||
		"untitled";

	const handleDownloadHtml = () => {
		const previewElement = getPreviewElement();
		if (!previewElement) {
			alert("Switch to Preview mode to download HTML.");
			return;
		}

		const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${getBaseFilename()}</title>
</head>
<body>
	<article>${previewElement.innerHTML}</article>
</body>
</html>`;

		const blob = new Blob([htmlContent], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${getBaseFilename()}.html`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleDownloadPdf = async () => {
		let previewElement = getPreviewElement();
		if (!previewElement) {
			setIsPreview(true);
			previewElement = await waitForPreviewElement();
		}

		if (!previewElement) {
			alert("Unable to render preview for PDF download.");
			return;
		}

		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			alert("Please allow popups to download PDF.");
			return;
		}

		const styleSheets = Array.from(document.styleSheets);
		let cssText = "";
		for (const sheet of styleSheets) {
			try {
				const rules = Array.from(sheet.cssRules);
				cssText += rules.map((rule) => rule.cssText).join("\n");
			} catch {
				if (sheet.href) {
					cssText += `@import url("${sheet.href}");\n`;
				}
			}
		}

		printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
	<title> </title>
	<style>${cssText}</style>
	<style>
		@page { margin: 5mm 12mm; }
		@media print {
			body { margin: 0; padding: 10mm; }
			.markdown-preview {
				padding: 0;
				max-width: none;
			}
			h1, h2, h3, h4, h5, h6 {
				break-after: avoid;
			}
			pre, code, blockquote, table, img, figure {
				break-inside: avoid;
			}
			p, li {
				orphans: 3;
				widows: 3;
			}
		}
	</style>
</head>
<body>
	<article class="markdown-preview prose prose-sm max-w-3xl mx-auto px-6 py-16">
		${previewElement.innerHTML}
	</article>
</body>
</html>`);
		printWindow.document.close();
		printWindow.addEventListener("afterprint", () => printWindow.close());
		// Give styles time to apply
		setTimeout(() => printWindow.print(), 250);
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
				filename={filename}
				onFilenameChange={handleFilenameChange}
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
				onDownloadMarkdown={handleDownload}
				onDownloadHtml={handleDownloadHtml}
				onDownloadPdf={handleDownloadPdf}
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
