import type { EditorView } from "@codemirror/view";

export interface SlashCommand {
	label: string;
	description: string;
	content?: string;
	action?: (view: EditorView, from: number, to: number) => void;
	inline?: boolean;
	modalId?: string;
}

export const slashCommands: SlashCommand[] = [
	{
		label: "toc",
		description: "Generate a table of contents from headings",
		action: (view, from, to) => {
			const doc = view.state.doc.toString();
			const lines = doc.split(/\r?\n/);

			const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+#+)?$/;
			const headings: { level: number; text: string }[] = [];

			for (const line of lines) {
				const match = line.match(headingRegex);
				if (match) {
					headings.push({ level: match[1].length, text: match[2].trim() });
				}
			}

			if (headings.length === 0) {
				view.dispatch(
					view.state.update({
						changes: { from, to, insert: "" },
						selection: { anchor: from },
					}),
				);
				return;
			}

			const minLevel = Math.min(...headings.map((h) => h.level));

			const toId = (text: string) =>
				text
					.toLowerCase()
					.trim()
					.replace(/[^\w\s-]/g, "")
					.replace(/\s+/g, "-");

			const tocLines = headings.map(({ level, text }) => {
				const indent = "  ".repeat(level - minLevel);
				const id = toId(text);
				return `${indent}- [${text}](#${id})`;
			});

			const toc = "**Table of contents**\n" + tocLines.join("\n");

			view.dispatch(
				view.state.update({
					changes: { from, to, insert: toc },
					selection: { anchor: from + toc.length },
				}),
			);
		},
	},
	{
		label: "table",
		description: "Insert a markdown table",
		content: `| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`,
	},
	{
		label: "image",
		description: "Insert an image",
		content: "![Alt text](https://example.com/image.jpg)",
		inline: true,
	},
	{
		label: "quote",
		description: "Insert a blockquote",
		content: "> This is a quote\n> that spans multiple lines",
	},
	{
		label: "todo",
		description: "Insert a task list",
		content: `- [ ] First task
- [ ] Second task
- [ ] Third task`,
	},
	{
		label: "code",
		description: "Insert a code block",
		content:
			'```javascript\n// Your code here\nconsole.log("Hello, world!");\n```',
	},
	{
		label: "list",
		description: "Insert a bullet list",
		content: `- First item
- Second item
- Third item`,
	},
	{
		label: "numbered",
		description: "Insert a numbered list",
		content: `1. First item
2. Second item
3. Third item`,
	},
	{
		label: "alerts",
		description: "Alerts, also sometimes known as callouts or admonitions",
		content: `> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.`,
	},
	{
		label: "heading1",
		description: "Insert a heading level 1",
		content: "# Heading 1",
	},
	{
		label: "heading2",
		description: "Insert a heading level 2",
		content: "## Heading 2",
	},
	{
		label: "heading3",
		description: "Insert a heading level 3",
		content: "### Heading 3",
	},
	{
		label: "divider",
		description: "Insert a horizontal divider",
		content: "---",
	},
	{
		label: "dummytext",
		description: "Insert lorem ipsum text",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
		inline: true,
	},
	{
		label: "link",
		description: "Insert a link",
		content: "[Link text](https://example.com)",
		inline: true,
	},
	{
		label: "bold",
		description: "Insert bold text",
		content: "**bold text**",
		inline: true,
	},
	{
		label: "italic",
		description: "Insert italic text",
		content: "*italic text*",
		inline: true,
	},
	{
		label: "sub",
		description: "Insert subscript text",
		content: "<sub>subscript</sub>",
		inline: true,
	},
	{
		label: "sup",
		description: "Insert superscript text",
		content: "<sup>superscript</sup>",
		inline: true,
	},
	{
		label: "kbd",
		description: "Insert keyboard input text",
		content: "<kbd>Ctrl</kbd>+<kbd>K</kbd>",
		inline: true,
	},
	{
		label: "ins",
		description: "Insert underlined text",
		content: "<ins>inserted text</ins>",
		inline: true,
	},
	{
		label: "br",
		description: "Insert a line break tag",
		content: "<br />",
		inline: true,
	},
	{
		label: "hr",
		description: "Insert a horizontal rule tag",
		content: "<hr />",
	},
	{
		label: "footnote",
		description: "Insert a footnote reference and definition",
		inline: true,
		action: (view, from, to) => {
			const doc = view.state.doc.toString();
			const footnoteRegex = /\[\^(\d+)\]/g;
			let maxN = 0;
			let match;
			while ((match = footnoteRegex.exec(doc)) !== null) {
				maxN = Math.max(maxN, parseInt(match[1]));
			}
			const n = maxN + 1;
			const refText = `[^${n}]`;
			const defText = `\n\n[^${n}]: footnote text`;
			const docLength = view.state.doc.length;

			view.dispatch(
				view.state.update({
					changes: [
						{ from, to, insert: refText },
						{ from: docLength, to: docLength, insert: defText },
					],
					selection: { anchor: from + refText.length },
				}),
			);
		},
	},
	{
		label: "license",
		description: "Add a license or copyright statement",
		modalId: "license",
		action: (view, from, to) => {
			// Remove the /license command text
			view.dispatch(
				view.state.update({
					changes: { from, to, insert: "" },
					selection: { anchor: from },
				}),
			);
		},
	},
];
