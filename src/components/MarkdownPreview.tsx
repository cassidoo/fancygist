import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/rose-pine-dawn.css";
// @ts-ignore
import markdownPuns from "../utils/techPuns";

interface MarkdownPreviewProps {
	content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
	return (
		<div className="h-full overflow-auto bg-white">
			<article className="markdown-preview prose prose-sm max-w-3xl mx-auto px-6 py-16">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeHighlight]}
				>
					{content || `**Nothing here yet!**\n\n${markdownPuns()}`}
				</ReactMarkdown>
			</article>
		</div>
	);
}
