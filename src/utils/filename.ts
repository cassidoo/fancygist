export const DEFAULT_MARKDOWN_FILENAME = "untitled.md";
export const MAX_GENERATED_FILENAME_BASE_LENGTH = 80;

export const normalizeMarkdownFilename = (
	value: string,
	maxBaseLength?: number,
): string => {
	const trimmed = value.trim();
	const withoutExtension = trimmed.replace(/\.(md|markdown)$/i, "");
	const rawSlug = withoutExtension
		.toLowerCase()
		.replace(/['"`]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	const slug = (maxBaseLength ? rawSlug.slice(0, maxBaseLength) : rawSlug).replace(
		/^-+|-+$/g,
		"",
	);

	return `${slug || "untitled"}.md`;
};

export const deriveMarkdownFilenameFromContent = (content: string): string => {
	const firstNonEmptyLine =
		content
			.split(/\r?\n/)
			.find((line) => line.trim().length > 0)
			?.replace(/^#+\s*/, "") || "";

	return normalizeMarkdownFilename(
		firstNonEmptyLine,
		MAX_GENERATED_FILENAME_BASE_LENGTH,
	);
};
